import Card from '../helpers/card';
import Zone from '../helpers/zone';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        //Load assets
        this.load.image('playing_field_one', 'src/assets/player_place_down_field_one.png');
        this.load.image('playing_field_two', 'src/assets/player_place_down_field_two.png');
        this.load.image('playing_field_three', 'src/assets/player_place_down_field_three.png');
        this.load.image('player_start_indicator', 'src/assets/player_start.png');
        this.load.image('bean_blue', 'src/assets/blue_bean.png');
        this.load.image('bean_fire', 'src/assets/fire_bean.png');
        this.load.image('bean_dirt', 'src/assets/dirt_bean.png');
        this.load.image('bean_puke', 'src/assets/puke_bean.png');
        this.load.image('bean_soy', 'src/assets/soy_bean.png');
        this.load.image('bean_eye', 'src/assets/eye_bean.png');
        this.load.image('bean_red', 'src/assets/red_bean.png');
        this.load.image('bean_garden', 'src/assets/garden_bean.png');
        this.load.image('bean_back', 'src/assets/back_bean.png');
    }

    create() {
        //XXX: Isn't cleaned, beware of misguiding
        let self = this;

        //Will be removed after testing
        this.isPlayerA = false;
        this.opponentCards = [];
        //TEST
        this.playerCount = 3;

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.drawText = this.add.text(0, 0, ['DRAW ONE CARD']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        /*
        this.playerZone = new Zone(this);
        this.playerDropZone = this.playerZone.renderZone(365, 590, 'playing_field_two');
        this.outline = this.playerZone.renderOutline(this.playerDropZone);
        //We don't need it to be interactive
        this.playerDropZone.disableInteractive();*/

        //Create Player Zone for three fields
        this.fieldOne = new Zone(this);
        //TODO: Hardcoding is bad
        //TODO: Drop relative to zone
        this.fieldOneDrop = this.fieldOne.renderZone(190, 580, 'playing_field_one');
        this.outline = this.fieldOne.renderOutline(this.fieldOneDrop);

        this.fieldTwo = new Zone(this);
        this.fieldTwoDrop = this.fieldTwo.renderZone(554, 580, 'playing_field_two');
        this.outline = this.fieldTwo.renderOutline(this.fieldTwoDrop);

        this.fieldThree = new Zone(this);
        this.fieldThreeDrop = this.fieldThree.renderZone(920, 580, 'playing_field_three');
        this.outline = this.fieldThree.renderOutline(this.fieldThreeDrop);

        this.dealer = new Dealer(this);

        this.socket = io('http://localhost:3000');

        //Useless cosmetics
        this.dealText.on('pointerover', function() {
            self.dealText.setColor('#ff69b4');
        });

        this.dealText.on('pointerout', function() {
            self.dealText.setColor('#00ffff');
        });

        this.dealText.on('pointerdown', function() {
            //Tell the server it should deal
            self.socket.emit('dealCards');
        });

        this.drawText.on('pointerdown', function() {
            //DEBUG
            self.dealer.draw();
        })

        //Funny drag event handling
        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', function(pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        });

        this.input.on('dragend', function(pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            //TODO: if statement, if the same type is already there
            //FIXME: gameObject.type is bullshit
            console.log(gameObject);
            dropZone.data.values.beanType = gameObject.type;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            // Tell the server we played a card, so the other clients know
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        });

        this.socket.on('connect', function() {
            console.log('Connected');
        });

        this.socket.on('isPlayerA', function() {
            self.isPlayerA = true;
        });

        this.socket.on('dealCards', function() {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });

        this.socket.on('cardPlayed', function(gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        });
    }

    update() {

    }
}