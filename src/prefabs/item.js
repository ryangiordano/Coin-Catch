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
    console.log("This is the parent, Item class.",game,x,y,asset);
        // this.game.physics.arcade.enable([this]);
        // this.scale.setTo(this.scaleRatio(), this.scaleRatio());

        //enable input on the bomb
        // this.inputEnabled = true;
        //then when user clicks it, activate the method on the object
  }
  checkWorldBounds() {
        if (!this.destroyed && this.body.position.x < 0) {
            // this.body.position.x = this.game.physics.arcade.bounds.x;
            this.body.velocity.x *= -this.body.bounce.x;
            this.body.blocked.left = true;
        } else if (!this.destroyed && this.body.position.x > this.game.world.width-70) {
            // this.position.x = this.game.physics.arcade.bounds.right - this.width;
            this.body.velocity.x *= -this.body.bounce.x;
            this.body.blocked.right = true;
        }
    }
  update(){
    super.update();
    // if(this.y > this.game.world.height){
    //   this.destroySelf();
    // }
    // this.checkWorldBounds()
  }
  destroySelf(){
    this.destroyed = true;
    this.destroy();
  }
  scaleRatio() {
      return window.devicePixelRatio / 3;
  }
}
