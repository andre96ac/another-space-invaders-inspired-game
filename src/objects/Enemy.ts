import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { GameScene } from "../scenes/GameScene.js";
import { RatioPowerUp } from "./RatioPowerUp.js";
import { DoublePowerUp } from "./DoublePowerUp.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { SpriteAnimation } from "../core/Prefabs/SpriteAnimation.js";

export class Enemy extends GameObject<SpaceInvaders>{


    private maxHealth = 3;
    private currentHealth = this.maxHealth;


    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {

    }
    public onUpdate(): void {
    }
    public onLoad(): void {
    }
    public onUnload(): void {
    }


    private _enemyStep: number;
    public get enemyStep(): number {return this._enemyStep};


    
    constructor(gameController: SpaceInvaders){
        const enemySize: Vector2 = Vector2.create(40, 20);
        super(gameController, "rectangle", Vector2.zero, enemySize);
        this._enemyStep = this.size.x + 20
        this.collidable = true;
        this.color = "rgb(255, 51, 153)";

    }

    public moveDown(_this: Enemy): void{
        if(_this.position.y + _this.size.y + _this.enemyStep < _this.gameController.mainContext.canvas.height){
            _this.position = Vector2.create(_this.position.x, _this.position.y + _this.enemyStep)
        }
        else{
            if(this.gameController.currentScene instanceof GameScene){
                this.gameController.currentScene.playerDie();
            }
        }
    }

    public hit(){
        if(this.currentHealth > 0){
            this.currentHealth --;
        }
        else{
            this.die()
        }
    }
    
    private die(){
        this.spawnExplosion();
        if(this.gameController.currentScene instanceof GameScene){
            this.gameController.currentScene.incrementKillCount();
        }
        this.gameController.playAudioOneShot("explosion.wav")
        if(this.gameController.currentScene instanceof GameScene&& Math.random() < this.gameController.currentScene.powerUpSpawnPercentage){
            this.spawnPowerUp();
        }

        this.destroy();

    }

    private spawnPowerUp(){
        const factory: new(gameController: SpaceInvaders) => DoublePowerUp | RatioPowerUp = Math.random() <= 0.5? DoublePowerUp : RatioPowerUp;
        const powerUp = this.gameController.currentScene.istantiateEl(factory);
        powerUp.moveAtCentre(this.center)
    }



    private spawnExplosion(){
        const explosion = this.gameController.currentScene.istantiateEl(SpriteAnimation, this.center);
        explosion.spriteList = [
            'explosion_01.png',
            'explosion_02.png',
            'explosion_03.png',
            'explosion_04.png',
            'explosion_05.png',
            'explosion_06.png',
        ]
        explosion.millisDuration = 600
        explosion.start();
    }


}