import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    console.log("Splash");
  }

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('heart', 'assets/images/heart.png');
    this.load.image('wall', 'assets/images/wall.png');
  }

  create () {
    this.state.start('Game')
  }
}
