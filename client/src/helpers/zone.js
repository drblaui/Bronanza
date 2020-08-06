export default class Zone {
    constructor(scene) {
        //Zone handeling 
        //TODO: Fields as zones
        this.renderZone = (x, y, sprite) => {
            let background = scene.add.image(x, y, sprite);
            let dropZone = scene.add.zone(x, y, background.displayWidth, background.displayHeight).setRectangleDropZone(background.displayWidth, background.displayHeight);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        }
    }
}