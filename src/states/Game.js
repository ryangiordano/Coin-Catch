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

export default class extends Phaser.State {
    init() {
        this.itemCount = 0;


        //create a round controller to govern the number of rounds in the game
        this.roundController = new RoundController(this.game,1);
        //create a scene controller to handle going from scene to scene
        this.sceneController = new SceneController(this.game);

    }
    preload() {
        this.coinGroup = this.game.add.group();
        this.bombGroup = this.game.add.group();
        this.investGroup = this.game.add.group();

        this.timeFrozen=false;
        //We're using observables to manage rounds~
        this.roundWatch$ = new Rx.Subject();
        let subscription = this.roundWatch$.subscribe(
            next => {
                if (next == "round-complete") {
                    this.betweenMatches = true;
                    if(this.roundController.roundCount -1 == 0){
                      this.betweenMatches = false;
                    setTimeout(()=>{
                        return this.sceneController.toScene('Win', true, false,{score:this.player.score, sessionId: this.sessionId})
                    },2000)
                    }
                    this.roundController.decrementAndUpdate();
                    this.explode(true);
                    setTimeout(() => {
                        this.setRound();
                        this.betweenMatches = false;
                    }, 2000)

                }
            }, error => {
                console.log(error);
            }, () => {
                console.log("Completed");
            })

    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //give the items gravity
        this.game.physics.arcade.gravity.y = 200;
        //keep track of the things that are in the air.
        this.setPlayer();
        // this.setWall();
        this.setRound();
    }
    update() {
        game.physics.arcade.collide(this.wall, this.coinGroup, () => {
            console.log("hitting");
        });

        if (!this.coinGroup.children.length && !this.betweenMatches) {
            this.roundWatch$.next('round-complete');
        }

    }
    setWall() {
        //create a boundary below the canvas for the items to be destroyed against
        this.wall = new Wall({
            game: this,
            x: this.world.centerX,
            y: this.world.y + this.world.height - 100,
            asset: 'wall'
        });
        this.game.add.existing(this.wall)
        var width = document.documentElement.clientWidth; // example;
        var height = 10 // example;

        this.game.physics.arcade.enable(this.wall);


        // this.game.physics.arcade.enable([]);

        this.wall.body.enable = true;
        this.wall.body.immovable = true;
        this.wall.body.allowGravity = false;
        this.wall.body.setSize(height, width)
    }
    setSprite(type) {
        let item;
        if (type == 'bomb') {
            this.itemCount++;
            item = new Bomb({
                game: this,
                x: this.world.centerX + this.game.rnd.integerInRange(-500, 500),
                y: this.world.y + this.world.height,
                asset: `${type}`,
            });
        } else if (type == 'coin') {
            this.itemCount++;
            item = new Coin({
                game: this,
                x: this.world.centerX + this.game.rnd.integerInRange(-500, 500),
                y: this.world.y + this.world.height,
                asset: `${type}`,
            });
        } else if (type == 'invest') {
            this.itemCount++;
            item = new Invest({
                game: this,
                x: this.world.centerX + this.game.rnd.integerInRange(-500, 500),
                y: this.world.y + this.world.height,
                asset: `${type}`,
            });
        }

        item.name = `${type}_${this.itemCount}`;
        item.type = `${type}`;
        this.game.physics.arcade.enable([item]);
        this.game.add.existing(item);
        if (type == 'coin') {
            this.coinGroup.add(item);
        } else if (type == 'bomb') {
            this.bombGroup.add(item);
        } else if (type == 'invest') {
            this.investGroup.add(item)
        }

        item.scale.setTo(this.scaleRatio(), this.scaleRatio());
        //enable input on the bomb
        item.inputEnabled = true;

        //then when user clicks it, activate the method on the object
        item.events.onInputDown.add(() => {
            this.handleClick(item, this);
        });
        this.launchSprite([item]);
    }
    removeSprite() {

    }
    setRound() {
        let randomNumberOfSprites = this.game.rnd.integerInRange(2, 10);
        let arrayOfTypes = ['coin', 'bomb'];
        for (let i = 0; i < randomNumberOfSprites; i++) {
            this.setSprite(arrayOfTypes[this.game.rnd.integerInRange(0, 1)]);
        }
        //every four rounds we launch a sprite
        if (this.roundController.roundCount % 4 == 0) {
            this.setSprite('invest')
        }
        this.roundStart = true;
    }
    handleClick(sprite, game) {
        if (sprite.type == 'bomb') {
            let lostHeart = this.player.health.pop();
            sprite.bombExplode(sprite);
            this.player.coins = Math.ceil(this.player.coins / 2);
            this.updateCoins(this.player.coins);
            lostHeart.destroy();
            this.bombGroup.remove(sprite);
            sprite.destroy();
        } else if (sprite.type == 'coin') {
            sprite.coinSparkle(sprite);
            this.player.score += sprite.scoreValue;
            this.player.coins += sprite.coinValue;
            this.updateScore(this.player.score);
            this.updateCoins(this.player.coins);
            this.coinGroup.remove(sprite);

            sprite.destroy();
        } else if (sprite.type == 'invest') {


              // this.freezeGroup([this.coinGroup,this.bombGroup, this.investGroup]);
              this.player.score += sprite.calcBonus(this.player.coins);
              this.player.coins =0;
              this.updateScore(this.player.score);
              this.updateCoins(this.player.coins);
              //harmlessly explode bombs
              this.explode(true);
              sprite.destroy();


        }
    }
    freezeGroup(group) {

        if (Array.isArray(group)) {
            group.forEach(singleGroup=>{
              singleGroup.children.forEach(child=>{
                child.body.allowGravity=false;
                child.body.velocity.setTo(0,0);

                child.body.allowRotation=false;
              })
            })
            this.timeFrozen = true;
        } else {
          group.children.forEach(child=>{
            child.body.allowGravity=false;
          })
          this.timeFrozen = true;
        }
    }
    unfreezeGroup(group){

      if (Array.isArray(group)) {
          group.forEach(singleGroup=>{
            singleGroup.children.forEach(child=>{
              child.body.allowGravity=true;
              child.body.velocity.setTo(0, this.game.rnd.integerInRange(-800 * this.scaleRatio(), this.scaleRatio() * -1000));
              child.body.allowRotation=true;
            })
          })
          this.timeFrozen = false;
      } else {
        group.children.forEach(child=>{
        child.body.allowGravity=true;
        })
        this.timeFrozen = false;
      }
    }
    explode(harmless) {
        //harmless is a boolean
        let count = 0;
        this.bombGroup.children.forEach(bomb => {
            count++;
            setTimeout(() => {
                if (harmless) {
                    bomb.bombFirework(bomb);
                } else {
                    bomb.bombExplode(bomb);
                }
                bomb.destroy();
            }, 100 * count)
        })
    }
    setPlayer() {
        this.player = new Player({
            game: this,
            x: 0,
            y: 0,
            asset: null
        })
        this.game.add.existing(this.player);
        this.player.setHealth(3);
        this.player.coins = 0;
        this.player.score = 0;
        this.setHUD();
    }
    setHUD() {
        //set the health bar
        let health = this.game.add.text(this.world.x + 20, 10, 'LIFE', {
            font: '30px VT323',
            fill: '#dddddd',
            align: 'left'
        })
        let healthStartx = this.world.x + 50;
        let offset = 80;
        this.player.health = [];
        for (let i = 0; i < this.player.maxHealth; i++) {
            let heart = new Heart({
                game: this,
                x: healthStartx + offset * i,
                y: 80,
                asset: 'heart',
            });
            heart.anchor.setTo(0.5, 0.5);
            this.game.add.existing(heart);
            heart.scale.setTo(this.scaleRatio(), this.scaleRatio());
            this.player.health.push(heart);
        }
        //set score
        let scoreLabel = this.game.add.text(this.world.x + 20, 120, 'SCORE', {
            font: '30px VT323',
            fill: '#dddddd',
            align: 'left'
        })
        this.scoreDisplay = this.game.add.text(this.world.x + 20, 150, '0', {
            font: '50px VT323',
            fill: '#dddddd',
            align: 'left'
        })
        //set coins
        let coinLabel = this.game.add.sprite(this.world.x + 300, 15, 'coin');
        coinLabel.scale.setTo(this.scaleRatio() * .4, this.scaleRatio() * .4);
        let x = this.game.add.text(this.world.x + 335, 5, 'x', {
            font: '50px VT323',
            fill: '#dddddd',
            align: 'left'
        });
        this.coinDisplay = this.game.add.text(this.world.x + 360, 5, '0', {
            font: '50px VT323',
            fill: '#dddddd',
            align: 'left'
        });
        this.roundController.setRounds();
    }
    updateScore(value) {
        this.scoreDisplay.setText(value);
    }
    updateCoins(value) {
        this.coinDisplay.setText(value);
    }
    launchSprite(array) {
        array.forEach(sprite => {

            // sprite.body.collideWorldBounds = true;
            sprite.body.bounce.y = 0.95;
            sprite.anchor.setTo(0.5, 0.5);
            sprite.body.enable = true;

            sprite.body.velocity.setTo(0, this.game.rnd.integerInRange(-1300 * this.scaleRatio(), this.scaleRatio() * -1800));
            // sprite.body.gravity.y = -1;
            sprite.body.gravity.isCircle = true;
            sprite.body.angularVelocity = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = 40;

        })
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
