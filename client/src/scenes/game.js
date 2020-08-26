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
        this.load.image('player_start_indicator', 'src/assets/player_start.jpg');
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
        this.playerCoins = 0;
        //TEST
        this.playerCount = 3;

        //this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
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
        this.fieldOneDrop = this.fieldOne.renderZone(190, 580, 'playing_field_one', 'pfOne');
        this.outline = this.fieldOne.renderOutline(this.fieldOneDrop);
        this.harvestPfOneText = this.add.text(0, this.fieldOneDrop.height, ['Harvest Field']).setFontSize(15).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.harvestPfOneText.x = (this.fieldOneDrop.x - (this.harvestPfOneText.width / 2));

        this.fieldTwo = new Zone(this);
        this.fieldTwoDrop = this.fieldTwo.renderZone(554, 580, 'playing_field_two', 'pfTwo');
        this.outline = this.fieldTwo.renderOutline(this.fieldTwoDrop);
        this.harvestPfTwoText = this.add.text(0, this.fieldTwoDrop.height, ['Harvest Field']).setFontSize(15).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.harvestPfTwoText.x = (this.fieldTwoDrop.x - (this.harvestPfTwoText.width / 2));

        this.fieldThree = new Zone(this);
        this.fieldThreeDrop = this.fieldThree.renderZone(920, 580, 'playing_field_three', 'pfThree');
        this.outline = this.fieldThree.renderOutline(this.fieldThreeDrop);
        this.harvestPfThreeText = this.add.text(0, this.fieldThreeDrop.height, ['Harvest Field']).setFontSize(15).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.harvestPfThreeText.x = (this.fieldThreeDrop.x - (this.harvestPfThreeText.width / 2));

        this.dealer = new Dealer(this);

        this.socket = io('http://localhost:3000');

        this.coinsText = this.add.text(50, 50, ['Coins: ' + this.playerCoins]).setFontSize(15).setFontFamily('Trebuchet MS ').setColor('#00ffff');

        this.harvestPfOneText.on('pointerdown', function() {
            let values = self.fieldOneDrop.data.values;
            let coins = values.contains[0].customData.values;
            let type = values.beanType;

            if (values.beanType != null) {
                values.beanType = null;
                values.cards = 0;

                let harvested = harvest(values.contains.length, coins);
                let reward = harvested[0];
                let remainder = harvested[1];
                self.playerCoins += reward;
                self.coinsText.text = 'Coins: ' + self.playerCoins;
                for (let i = 0; i < values.contains.length; i++) {
                    let card = values.contains[i];
                    card.destroy();
                }
                for (let i = 0; i < remainder; i++) {
                    self.dealer.throwAway(new Card(self, type, coins));
                }
                console.log(self.dealer.throwDeck);
                values.contains = []
            }
        });

        function harvest(amount, values) {
            Array.prototype.max = function() {
                return Math.max.apply(null, this);
            }
            Array.prototype.min = function() {
                return Math.min.apply(null, this);
            }

            var coins = 0;
            var remainCards = 0;
            while (amount != 0) {
                while (amount > values.max()) {
                    coins += (values.indexOf(values.max()) + 1);
                    amount -= values.max();
                }
                if (values.includes(amount)) {
                    coins += (values.indexOf(amount) + 1);
                    amount = 0;
                    continue;
                } else if (amount < values.min()) {
                    remainCards = amount;
                    amount = 0;
                    continue;
                } else {
                    amount--;
                }
            }
            console.log(remainCards);
            return [coins, remainCards];
        }

        this.drawText.on('pointerdown', function() {
            //DEBUG
            self.dealer.draw();
        });

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
            if (gameObject.customData.type === dropZone.data.values.beanType || dropZone.data.values.beanType == null) {
                dropZone.data.values.cards++;
                dropZone.data.values.beanType = gameObject.customData.type;
                dropZone.data.values.contains.push(gameObject);
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y + (dropZone.data.values.cards * 50);
                gameObject.disableInteractive();
                // Tell the server we played a card, so the other clients know
                self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
            } else {
                gameObject.setTint();
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
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