import Deck from './deck';

//Dealer that works with our global Deck
//TODO: Test if every user get's his own Deck or if it is actually global (Need more client testers)
export default class Dealer {
    constructor(scene) {
        //Init decks
        this.playDeck = new Deck(scene);
        this.playDeck.createFullSet();
        this.throwDeck = new Deck(scene);
        this.dealCards = (players) => {
            //On game Start
            let playCards = this.playDeck.draw(5);

            for (let i = 0; i < 5; i++) {
                let card = playCards[i];
                card.render(800 + (i * 100), 650, 'bean_' + card.type);
            }
        }
        this.draw = () => {
            //Debug reasons
            let card = this.playDeck.draw(1)[0];
            card.render(800, 650, 'bean_' + card.type);
        }
        this.throwAway = (card) => {
            this.throwDeck.putCardOn(card);
        }
    }

}