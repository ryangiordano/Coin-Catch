/* globals __DEV__ */
import Phaser from 'phaser'
import Rx from 'rxjs';
import Bomb from '../prefabs/Bomb';
import Coin from '../prefabs/Coin';
import Player from '../prefabs/Player';
import Heart from '../prefabs/Heart';
import Invest from '../prefabs/Invest';

import RoundController from '../state-management/RoundController';
import SceneController from '../state-management/SceneController';

export default class extends Phaser.State {
    init() {
        //create a round controller to govern the number of rounds in the game
        this.roundController = new RoundController(this.game, 15);
        //create a scene controller to handle going from scene to scene
        this.sceneController = new SceneController(this.game);
        //create a session id for the game.
        this.sessionId = new Date().getTime();
    }
    preload() {
        this.coinGroup = this.game.add.group();
        this.bombGroup = this.game.add.group();
        this.investGroup = this.game.add.group();
        this.timeFrozen = false;
        //We're using observables to manage rounds~
        this.roundWatch$ = new Rx.Subject();
        let roundSubscription = this.roundWatch$.subscribe(
            next => {
                if (next == "round-complete") {
                    console.log('round complete');
                    this.betweenMatches = true;
                    if (this.roundController.roundCount - 1 == 0) {
                        this.explode(true);//harmless
                        setTimeout(() => {
                          this.betweenMatches = false;
                            return this.sceneController.toScene('Win', true, false, {
                                score: this.player.score,
                                sessionId: this.sessionId
                            })
                        }, 2000)
                    }else{
                      this.roundController.decrementAndUpdate();
                      this.explode(true);//harmless
                      setTimeout(() => {
                          this.setRound();
                          this.betweenMatches = false;
                      }, 2000)
                    }
                }
                if (next == "round-lost") {
                    this.betweenMatches = true;
                    console.log(this.sessionId);
                    setTimeout(() => {
                        return this.sceneController.toScene('Win', true, false, {
                            score: this.player.score,
                            sessionId: this.sessionId
                        })
                    }, 2000)
                }
            }, error => {
                console.log(error);
            }, () => {
                console.log("Completed");
            })

        this.coinWatch$ = new Rx.Subject();
        let coinSubscription = this.coinWatch$.subscribe(
          next=>{
            if(next.length == 0){
              console.log("coins gone");
            }
          },
          error=>{

          },
          ()=>{
            console.log('complete');
          }
        )
    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //give the items gravity
        this.game.physics.arcade.gravity.y = 200;
        //keep track of the things that are in the air.
        this.setPlayer();
        this.setRound();
    }
    update() {
        // game.physics.arcade.collide(this.wall, this.coinGroup, () => {
        //     console.log("hitting");
        // });
        if (!this.coinGroup.children.length &&
            !this.investGroup.children.length && !this.betweenMatches) {
            this.roundWatch$.next('round-complete');
        }
        //player health is 0
        if (!this.player.health.length && !this.betweenMatches) {
            this.roundWatch$.next('round-lost');
        }
    }
    setSprite(type) {
        let item;
        let randomX = this.game.rnd.integerInRange(-500, 500);
        if (type == 'bomb') {
            item = new Bomb({
                game: this,
                // x: this.world.centerX + randomX,
                // y: this.world.y + this.world.height,
                // asset: `${type}`,
            });

        } else if (type == 'coin') {
            item = new Coin({
                game: this,
                x: this.world.centerX + randomX,
                y: this.world.y + this.world.height,
                // asset: `${type}`,
            });
        } else if (type == 'invest') {
            item = new Invest({
                game: this,
                x: this.world.centerX + randomX,
                y: this.world.y + this.world.height,
                // asset: `${type}`,
            });
        }
        //place the item on the world
        item.x= this.world.centerX + randomX
        item.y= this.world.y + this.world.height
        //load the texture, set the scale of the item, the type of the item, enabe phyiscs, and then add the game to the scene
        item.loadTexture(type);
        item.scale.setTo(this.game.scaleRatio());
        item.type = type;
        this.game.physics.arcade.enable([item]);
        this.game.add.existing(item);

        if (type == 'coin') {
            this.coinGroup.add(item);
        } else if (type == 'bomb') {
            this.bombGroup.add(item);
        } else if (type == 'invest') {
            this.investGroup.add(item)
        }
        //enable input on the bomb
        item.inputEnabled = true;

        //then when user clicks it, activate the method on the object
        item.events.onInputDown.add(() => {
            this.handleClick(item, this);
        });

        this.launchSprite([item]);
    }
    launchSprite(array) {
        array.forEach(sprite => {
            // sprite.body.collideWorldBounds = true;
            sprite.body.bounce.y = 0.95;
            sprite.body.bounce.x = 0.95;
            sprite.anchor.setTo(0.5, 0.5);
            sprite.body.enable = true;

            sprite.body.velocity.setTo(this.game.rnd.integerInRange(-800 * this.game.scaleRatio(), this.game.scaleRatio() * 800),this.game.rnd.integerInRange(-1300 * this.game.scaleRatio(), this.game.scaleRatio() * -1800));
            // sprite.body.gravity.y = -1;
            sprite.body.gravity.isCircle = true;
            sprite.body.angularVelocity = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = 40;

        })
    }
    setRound() {
        let nextRound = this.roundController.setNextRound();
        nextRound.forEach(item=>{
          this.setSprite(this.roundController.typeMap.get(item));
        })
        // let randomNumberOfSprites = this.game.rnd.integerInRange(2, 10);
        // let arrayOfTypes = ['coin', 'bomb'];
        // for (let i = 0; i < randomNumberOfSprites; i++) {
        //     this.setSprite(arrayOfTypes[this.game.rnd.integerInRange(0, 1)]);
        // }
        // //every four rounds we launch a sprite
        // if (this.roundController.roundCount % 4 == 0) {
        //     this.setSprite('invest')
        // }
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

        } else if (sprite.type == 'coin') {

            this.player.score += sprite.scoreValue;
            this.player.coins += sprite.coinValue;
            this.updateScore(this.player.score);
            this.updateCoins(this.player.coins);
            this.coinGroup.remove(sprite);
            sprite.coinCollect(sprite);
            this.coinWatch$.next(this.coinGroup);
        } else if (sprite.type == 'invest') {
            this.coinsToScore({
              coins:this.player.coins,
              score:this.player.score,
              scoreDisplay:this.scoreDisplay,
              coinDisplay:this.coinDisplay
            },sprite);

            // this.freezeGroup([this.coinGroup,this.bombGroup, this.investGroup]);

            //harmlessly explode bombs
            this.explode(true);
            sprite.destroy();

        }
    }
    coinsToScore({coins,score,scoreDisplay,coinDisplay},investSprite){
      // TODO: Make it so the coins go to the score.
      //USE OBSERVABLES WITH A STAGGER
      while(coins){
        coins--;
        this.player.coins = coins;
        this.updateCoins(this.player.coins);

      }
      this.player.score += investSprite.calcBonus(this.player.coins);
this.updateScore(this.player.score);
    }
    freezeGroup(group) {        if (Array.isArray(group)) {
            group.forEach(singleGroup => {
                singleGroup.children.forEach(child => {
                    child.body.allowGravity = false;
                    child.body.velocity.setTo(0, 0);

                    child.body.allowRotation = false;
                })
            })
            this.timeFrozen = true;
        } else {
            group.children.forEach(child => {
                child.body.allowGravity = false;
            })
            this.timeFrozen = true;
        }
    }
    unfreezeGroup(group) {

        if (Array.isArray(group)) {
            group.forEach(singleGroup => {
                singleGroup.children.forEach(child => {
                    child.body.allowGravity = true;
                    child.body.velocity.setTo(0, this.game.rnd.integerInRange(-800 * this.game.scaleRatio(), this.game.scaleRatio() * -1000));
                    child.body.allowRotation = true;
                })
            })
            this.timeFrozen = false;
        } else {
            group.children.forEach(child => {
                child.body.allowGravity = true;
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
            heart.scale.setTo(this.game.scaleRatio(), this.game.scaleRatio());
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
        coinLabel.scale.setTo(this.game.scaleRatio() * .4, this.game.scaleRatio() * .4);
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
        this.roundController.displayRound();
    }
    updateScore(value) {
        this.scoreDisplay.setText(value);
    }
    updateCoins(value) {
        this.coinDisplay.setText(value);
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32);
        }

    }
}
