import Phaser from 'phaser';
import Item from './item';
export default class extends Item{
  constructor(game,x,y,asset){
    super(game,x,y,asset);
        // console.log(`x: ${x}`, `y: ${y}`);
    // console.log("This is the bomb extension of item.",game,x,y,asset);

  }
  bombExplode(sprite){
    let explodeWave =this.game.add.sprite(sprite.position.x,sprite.position.y,'coin-collect-reverse');
    explodeWave.anchor.setTo(0.5, 0.5);
    explodeWave.scale.setTo(this.game.scaleRatio(), this.game.scaleRatio());
    explodeWave.animations.add('coin-collect-reverse');
    explodeWave.animations.play('coin-collect-reverse',24,false,true);
    this.game.camera.shake(0.03, 200);
    let explodeEmitter = this.game.add.emitter(sprite.position.x, sprite.position.y);
    let lifeTime = 5000;
    explodeEmitter.makeParticles('explode', [0], this.game.rnd.integerInRange(50,60), true, false);
    explodeEmitter.gravity = -100;
    explodeEmitter.minParticleScale = 0.5;
    explodeEmitter.maxParticleScale = 3;
    // explodeEmitter.minParticleSpeed.setTo(-100,100);
    // explodeEmitter.maxParticleSpeed.setTo(-200,200);
    explodeEmitter.forEach(single=>{
      single.minRotation = this.game.rnd.integerInRange(0,50);
      single.maxRotation = this.game.rnd.integerInRange(100,200);

      single.animations.add('explode');
      single.animations.play('explode',this.game.rnd.integerInRange(10,30),false,true);
    })
    this.alpha = 0;
    setTimeout(()=>{
      explodeEmitter.start(true, lifeTime, 1500, 30, true);
        this.destroySelf();
    },200)
  }
  bombFirework(sprite){
    console.log("fireworks");
      let random = this.game.rnd;
    //set the color of the firework
    let color = this.colorMap.get(random.integerInRange(0,5));
    this.game.camera.shake(0.01, 100);

    let explodeWave =this.game.add.sprite(sprite.position.x,sprite.position.y,'coin-collect-reverse');
    explodeWave.anchor.setTo(0.5, 0.5);
    explodeWave.scale.setTo(this.game.scaleRatio()*7, this.game.scaleRatio()*7);
    explodeWave.animations.add('coin-collect-reverse');
    explodeWave.animations.play('coin-collect-reverse',24,false,true);



    let explodeEmitter = this.game.add.emitter(sprite.position.x, sprite.position.y);

    let lifeTime = 3000;
    explodeEmitter.makeParticles(color, [0], random.integerInRange(50,60), true, false);

    explodeEmitter.gravity = -150;


    explodeEmitter.minParticleScale = 0.5;
    explodeEmitter.maxParticleScale = 3;
    // explodeEmitter.minParticleSpeed.setTo(-100,100);
    // explodeEmitter.maxParticleSpeed.setTo(-200,200);
    explodeEmitter.forEach(single=>{

      single.minRotation = random.integerInRange(0,50);
      single.maxRotation = random.integerInRange(100,200);

      single.animations.add(color);
      single.animations.play(color,random.integerInRange(10,30),true,true);
    });
    this.alpha = 0;

      explodeEmitter.start(true, lifeTime, 1500, 100, true);
      this.destroySelf();

  }
  update(){
    super.update();
  }

}
