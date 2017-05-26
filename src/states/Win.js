/* globals __DEV__ */
import Phaser from 'phaser'
import FirebaseConnection from '../database/DatabaseConnection';
import Rx from 'rxjs';
import Mushroom from '../prefabs/Mushroom';
import Bomb from '../prefabs/Bomb';
import Coin from '../prefabs/Coin';
import Player from '../prefabs/Player';
import Heart from '../prefabs/Heart';
import Wall from '../prefabs/Wall';
import Invest from '../prefabs/Invest';
import CoinParticle from '../prefabs/particles/Coin.particle';
import RoundController from '../state-management/RoundController';
import SceneController from '../state-management/SceneController';
import WebFont from 'webfontloader'

export default class extends Phaser.State {
    init(parameter) {
      this.score = parameter.score;
      this.sessionId = parameter.sessionId;
      this.firebase = new FirebaseConnection(this.game.gameId, this.game.sessionId);
    }
    preload() {
      WebFont.load({
        google: {
          families: ['Bangers', 'VT323']
        },
        active: this.fontsLoaded
      })

      let win = this.add.text(this.world.centerX, this.world.centerY, 'You Win', { font: '30px VT323', fill: '#dddddd', align: 'center' })
      win.anchor.setTo(0.5, 0.5);
      let score = this.add.text(this.world.centerX, this.world.centerY + 40, `Your score was: ${this.score}`, { font: '50px VT323', fill: '#dddddd', align: 'center' })
      score.anchor.setTo(0.5, 0.5);

    }
    create() {

    }
    update() {


    }

    scaleRatio() {
        return window.devicePixelRatio / 3;
    }
    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32);
        }

    }
}
