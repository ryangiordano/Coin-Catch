export default class{
  constructor(game){
    this.game = game;

  }
  toScene(scene, clearWorld, clearCache,parameter){
    this.game.state.start(scene,clearWorld, clearCache,parameter);
  }
}
