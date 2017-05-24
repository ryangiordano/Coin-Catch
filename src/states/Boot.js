import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    console.log("Boot");
    this.stage.backgroundColor = '#2d2d2d'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    //
    // load your assets
    //
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('heart', 'assets/images/heart.png');
    this.load.image('wall', 'assets/images/wall.png');
    this.load.spritesheet('coin-sparkle', 'assets/images/coin-sparkle.png',32,32)
    this.load.spritesheet('coin-collect', 'assets/images/coin-collect.png',32,32)
    this.load.spritesheet('coin-collect-reverse', 'assets/images/coin-collect-reverse.png',32,32)
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
