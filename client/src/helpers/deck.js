import Card from "./card";

//Map our Decks (both the draw deck and the throwaway deck)
//Should we track the Cards a user harvested?
export default class Deck {
    constructor(scene) {
        this.deckCards = [];
        this.createFullSet = () => {
            //Create Deck with all beans
            //TODO: IF ELSE IF ELSE IF ELSE, what are you Yandere Dev?
            //HACK
            for (let i = 20; i > 0; i--) {
                let blueBean = new Card(scene, 'blue', [4, 6, 8, 10]);
                this.deckCards.push(blueBean);
                if (i <= 18) {
                    let fireBean = new Card(scene, 'fire', [3, 6, 8, 9]);
                    this.deckCards.push(fireBean);
                }
                if (i <= 16) {
                    let dirtBean = new Card(scene, 'dirt', [3, 5, 7, 8]);
                    this.deckCards.push(dirtBean);
                }
                if (i <= 14) {
                    let pukeBean = new Card(scene, 'puke', [3, 5, 6, 7]);
                    this.deckCards.push(pukeBean);
                }
                if (i <= 12) {
                    let soyBean = new Card(scene, 'soy', [2, 4, 6, 7]);
                    this.deckCards.push(soyBean);
                }
                if (i <= 10) {
                    let eyeBean = new Card(scene, 'eye', [2, 4, 5, 6]);
                    this.deckCards.push(eyeBean);
                }
                if (i <= 8) {
                    let redBean = new Card(scene, 'red', [2, 3, 4, 5]);
                    this.deckCards.push(redBean);

                }
                if (i <= 6) {
                    //FIXME: 2 Beans actually give two coins, but we would only get one here
                    //FIXED: Nulls just get skipped in card evaluation
                    let gardenBean = new Card(scene, 'garden', [null, 2, 3]);
                    this.deckCards.push(gardenBean);
                }
            }
            this.shuffle();
            return this.deckCards;
            //BUG: Sometimes beans are weird
        }
        this.shuffle = () => {
            let deck = this.deckCards;
            var currentIndex = deck.length;
            let temporaryValue, randomIndex;
            //Modern version of the Fisher-Yated shuffle algorithm
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = deck[currentIndex];
                deck[currentIndex] = deck[randomIndex];
                deck[randomIndex] = temporaryValue;
            }
            this.deckCards = deck;
        }
        this.draw = (amount) => {
            //Draw the first n cards
            let output = [];
            if (this.deckCards.length > 1) {
                for (let i = 0; i < amount; i++) {
                    output.push(this.deckCards[0]);
                    this.deckCards.splice(0, 1);
                }
                return output;
            } else {
                return [this.deckCards[0], amount - 1];
            }
        }
        this.putCardOn = (card) => {
            //Put one card on the deck (for trash deck)
            this.deckCards.push(card);
        }
    }
}