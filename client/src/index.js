import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 780,
    // HAVE game.js handle everything
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);