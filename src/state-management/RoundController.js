export default class{
  constructor(game,roundCount){
    this.game = game;
    this.roundCount = roundCount;
  }
  decrementAndUpdate(){
    this.roundCount--;
    this.roundDisplay.setText(this.roundCount)
  }
  setRounds(){
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
}
