import Phaser from 'phaser';

export default class extends Phaser.Sprite{
  constructor({game,x,y,asset}){
    super(game,x,y,asset);

  }
  bombExplode(){
    this.game.camera.shake(0.01, 200);
  }
  update(){
    super.update();
    if(this.y > this.game.world.height){
      this.destroy();
    }
  }
}
