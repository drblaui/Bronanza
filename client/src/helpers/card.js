export default class Card {
    //Skeleton for cards
    constructor(scene, type, values) {
        this.type = type;
        this.values = values; // REMEMBER: use Format like [No. of Beans for 1 Coin, No. of Beans for 2 Coins, etc]
        this.render = (x, y, sprite) => {
            //Render card at x,y with the sprite
            let card = scene.add.image(x, y, sprite).setScale(0.3, 0.3).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}