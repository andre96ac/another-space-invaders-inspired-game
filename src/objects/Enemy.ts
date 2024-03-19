import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { GameScene } from "../scenes/GameScene.js";
import { RatioPowerUp } from "./RatioPowerUp.js";
import { MultiShotPowerUp } from "./MultiShotPowerUp.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { SpriteAnimation } from "../core/Prefabs/SpriteAnimation.js";
import { Player } from "./Player.js";
import { DamagePowerUp } from "./DamagePowerUp.js";

export class Enemy extends GameObject<SpaceInvaders>{


    private maxHealth = 3;
    private currentHealth = this.maxHealth;


    public onUpdate(): void {
        const center = this.center;
        let size = this.currentHealth / this.maxHealth * 20
        size += 20;
        this.size = Vector2.create(size, size);
        this.moveAtCentre(center);

    }
    public onLoad(): void {
    }
    public onUnload(): void {
    }


    private _enemyStep: number;
    public get enemyStep(): number {return this._enemyStep};


    
    constructor(gameController: SpaceInvaders){
        const enemySize: Vector2 = Vector2.create(40, 40);
        super(gameController, "rectangle", Vector2.zero, enemySize);
        this._enemyStep = this.size.x + 20
        this.collidable = true;
        this.color = "#00c0b7";
        this.lineWidth = 2

    }

    
    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {

        if(other instanceof Player && this.gameController.currentScene instanceof GameScene){
            this.gameController.currentScene.playerDie();
        }

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

    public hit(damage: number){
        if(this.currentHealth - damage > 0){
            this.currentHealth -= damage;
        }
        else{
            this.die()
        }
    }
    
    private die(){
        this.spawnExplosion();
        if(this.gameController.currentScene instanceof GameScene){
            this.gameController.currentScene.incrementKillCount();
            if(Math.random() < this.gameController.currentScene.powerUpSpawnPercentage){
                this.spawnPowerUp();
            }
        }
        this.gameController.playAudioOneShot("explosion.wav")

        this.destroy();

    }

    private spawnPowerUp(){
        type TPowerUp =     MultiShotPowerUp 
                            | RatioPowerUp
                            | DamagePowerUp
        const powerUps = [
            // MultiShotPowerUp,
            // RatioPowerUp,
            DamagePowerUp
        ]

        const choose = Math.floor(Math.random() * powerUps.length)
        
        
        const factory = powerUps[choose]
        const powerUp = this.gameController.currentScene.istantiateEl<TPowerUp>(factory);
        powerUp.moveAtCentre(this.center)
    }



    private spawnExplosion(){
        const explosion = this.gameController.currentScene.istantiateEl(SpriteAnimation, this.center);
        explosion.loadAssets([
            'explosion/_(1).png',
            'explosion/_(2).png',
            'explosion/_(3).png',
            'explosion/_(4).png',
            'explosion/_(5).png',
            'explosion/_(6).png',
            'explosion/_(7).png',
            'explosion/_(8).png',
            'explosion/_(9).png',
            'explosion/_(10).png',
            'explosion/_(11).png',
            'explosion/_(12).png',
            'explosion/_(13).png',
            'explosion/_(14).png',
        ])
        explosion.millisDuration = 300
        explosion.start();
    }


}