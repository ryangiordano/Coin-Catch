import Phaser from 'phaser';
import Heart from './Heart';
export default class extends Phaser.Sprite {
    constructor({game,x,y,asset}) {
        super(game, x, y, asset);
        this.coins;
        this.score;
    }

    update() {}

    setHealth(health) {
      this.maxHealth = health;
    }
}
