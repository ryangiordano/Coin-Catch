import Phaser from 'phaser';
import Bomb from '../prefabs/Bomb';
import Coin from '../prefabs/Coin';
import Invest from '../prefabs/Invest';


export default class{
  constructor(game,roundCount, roundPlan){
    this.game = game;
    this.sampleRound = [
            [0,0,0,0,0,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0],
      [0,1,1],
      [0,0,0,1,1,1,1,1],
      [0,0,0,0,0,1,1,1,1,1,1,1,1],
      [0,2,0],
      [0,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,1,1,1,1,1],
      [0,0,0,0,0,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,1,2,1,1],
      [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1],
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0],
      [0,0,0,0,0,2,1,1,1]
      [0,1],
      [0,1],
      [0,1],
      [0,1]
    ];

    this.roundCount = roundCount;
    this.roundPlan = roundPlan;
    this.typeMap = new Map([
      [0,'bomb'],
      [1,'coin'],
      [2,'invest']
    ])

  }
  decrementAndUpdate(){
    this.roundCount--;
    this.roundDisplay.setText(this.roundCount)
  }
  displayRound(){
    //set rounds
    let rounds = this.game.add.text(this.game.world.x + 500, 20, 'Rounds Left', {
        font: '30px VT323',
        fill: '#dddddd',
        align: 'left'
    })
    this.roundDisplay = this.game.add.text(this.game.world.x + 600, 50, this.roundCount, {
        font: '50px VT323',
        fill: '#dddddd',
        align: 'left'
    })
  }
  setNextRound(){
    return this.sampleRound.shift();
    this.game.roundStart = true;
  }

}
