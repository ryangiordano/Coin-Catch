import Phaser from 'phaser';

export default class extends Phaser.Sprite{
  constructor({game,x,y,asset}){
    super(game,x,y,asset);

  }
  update(){
  }
  coinSparkle(sprite) {
      let coinCollect =this.game.add.sprite(sprite.position.x,sprite.position.y,'coin-collect-reverse');
      coinCollect.anchor.setTo(0.5, 0.5);
      coinCollect.scale.setTo(this.scaleRatio()*7, this.scaleRatio()*7);
      coinCollect.animations.add('coin-collect-reverse');
      coinCollect.animations.play('coin-collect-reverse',24,false,true);
      let coinSparkleEmitter = this.game.add.emitter(sprite.position.x, sprite.position.y);
      let lifeTime = 3000;
      coinSparkleEmitter.makeParticles('coin-sparkle', [0], this.game.rnd.integerInRange(50,60), true, false);
      coinSparkleEmitter.gravity = -100;
      coinSparkleEmitter.forEach(single=>{
        single.minRotation = this.game.rnd.integerInRange(0,50);
        single.maxRotation = this.game.rnd.integerInRange(100,200);
        single.animations.add('coin-sparkle');
        single.animations.play('coin-sparkle',this.game.rnd.integerInRange(10,30),false,true);
      })
      setTimeout(()=>{
        coinSparkleEmitter.start(false, lifeTime, 1500, 30, true);
        setTimeout(()=>{
          coinSparkleEmitter.destroy();
        },lifeTime)
      },200)
  }
  scaleRatio() {
      return window.devicePixelRatio / 3;
  }
  update(){
    super.update();
    if(this.y > this.game.world.height){
      this.destroy();
    }
  }
}
