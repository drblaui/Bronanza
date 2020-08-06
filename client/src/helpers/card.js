export default class Card {
    constructor(scene, type, values) {
        this.type = type;
        this.values = values;
        this.render = (x, y, sprite) => {
            //Render card at x,y with the sprite
            let card = scene.add.image(x, y, sprite).setScale(0.3, 0.3).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}