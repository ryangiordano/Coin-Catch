import Phaser from 'phaser';

export default class extends Phaser.Sprite{
  constructor({game,x,y,asset}){
    super(game,x,y,asset);

  }

  update(){
  }
  calcBonus(coinsInvested){
    if(coinsInvested >= 10){
      return Math.ceil(coinsInvested * 1.5);
    }
    if(coinsInvested >= 20){
      return coinsInvested * 2
    }
    if(coinsInvested >= 30){
      return coinsInvested*3
    }
    if(coinsInvested >= 40){
      return coinsInvested*5
    }
    return coinsInvested;
  }
}
