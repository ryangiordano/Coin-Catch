import Phaser from 'phaser';

export default class extends Phaser.Sprite{
  constructor({game,x,y,asset}){
    super(game,x,y,asset);
    this.colorMap = new Map([
      [0,'flash-red'],
      [1,'flash-blue'],
      [2,'flash-green'],
      [3,'flash-pink'],
      [4,'flash-gold'],
      [5,'flash-lb']
    ]);
  }
  investFirework(sprite){
    //set the color of the firework
    let color = this.colorMap.get(this.game.rnd.integerInRange(0,5));
    this.game.camera.shake(0.01, 100);

    let explodeWave =this.game.add.sprite(sprite.position.x,sprite.position.y,'coin-collect-reverse');
    explodeWave.anchor.setTo(0.5, 0.5);
    explodeWave.scale.setTo(this.scaleRatio()*7, this.scaleRatio()*7);
    explodeWave.animations.add('coin-collect-reverse');
    explodeWave.animations.play('coin-collect-reverse',24,false,true);



    let explodeEmitter = this.game.add.emitter(sprite.position.x, sprite.position.y);

    let lifeTime = 3000;
    explodeEmitter.makeParticles(color, [0], this.game.rnd.integerInRange(50,60), true, false);

    explodeEmitter.gravity = -150;


    explodeEmitter.minParticleScale = 0.5;
    explodeEmitter.maxParticleScale = 3;
    // explodeEmitter.minParticleSpeed.setTo(-100,100);
    // explodeEmitter.maxParticleSpeed.setTo(-200,200);
    explodeEmitter.forEach(single=>{
      single.minRotation = this.game.rnd.integerInRange(0,50);
      single.maxRotation = this.game.rnd.integerInRange(100,200);

      single.animations.add(color);
      single.animations.play(color,this.game.rnd.integerInRange(10,30),true,true);
    })
    setTimeout(()=>{
      explodeEmitter.start(true, lifeTime, 1500, 100, true);
    },200)
  }
  update(){
    super.update();
    if(this.y > this.game.world.height){
      this.destroy();
    }
  }
  calcBonus(coinsInvested){

    if(coinsInvested >= 10){

      return Math.ceil(coinsInvested *5* 1.5);
    }
    if(coinsInvested >= 20){
      return coinsInvested *5* 2
    }
    if(coinsInvested >= 30){
      return coinsInvested*5*3
    }
    if(coinsInvested >= 40){
      return coinsInvested*5*5
    }
    return coinsInvested*5;
  }
  scaleRatio() {
      return window.devicePixelRatio / 3;
  }
}
