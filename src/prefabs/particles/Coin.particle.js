import Phaser from 'phaser';

export default class extends Phaser.Particle {

    constructor({game,x,y}) {
        super(game, x, y, 'coin-sparkle');
        console.log("hello");
        this.currentFrame = Math.floor(Math.random() * 22);
        this.elapsedTime = 0;
        this.game = game;
        
    }
    create() {

    }
    onEmit() {

        this.animations.add("coin-sparkle", [0, 1, 2, 3, 4, 5], 5, true);
        this.animations.stop("coin-sparkle");
        this.animations.play("coin-sparkle", 60, true);
        this.animations.getAnimation('coin-sparkle').frame = Math.floor(Math.random() * this.animations.getAnimation('coin-sparkle').frameTotal);
    }
}
