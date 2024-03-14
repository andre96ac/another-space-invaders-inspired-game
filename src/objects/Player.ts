import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { Bullet } from "./Bullet.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { ScheduledInterval, ScheduledTask, ScheduledTimeout } from "../core/Helpers/ScheduledTask.js";

export class Player extends GameObject<SpaceInvaders>{


    //delay di spawn dei proiettili
    private bulletRatio: number = 300;

    //bullet spawn interval
    private bulletSpawnIntervalPtr: undefined | ScheduledInterval;

    //Player Speed
    private playerSpeed: number = 3;

    private ratioPowerUpDuration: number = 10000;
    private doublePowerUpDuration: number = 10000;

    private removeRatioPowerUpTimeoutPtr : undefined | ScheduledTimeout;
    private removeDoublePowerUpTimeoutPtr : undefined | ScheduledTimeout;

    private doubleShotActive: boolean = false; 
    private ratioActive: boolean = false; 

    private get computedColor(): string{
        if(this.doubleShotActive && this.ratioActive)
            return 'rgb(0, 255, 0)'
        else if(this.doubleShotActive)
            return 'rgb(255, 255, 0)'
        else if(this.ratioActive)
            return 'rgb(0, 255, 153)'
        else    
            return 'white'
    }

    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
    }
    public onUpdate(): void {
    
    }
    public onLoad(): void {
                //faccio partire il timer degli spari
                this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => {
                   this.shot();
                }, this.bulletRatio)

    }
    public onUnload(): void {
    }


    constructor(gameController: SpaceInvaders){
        const playerSize = 30;
        super(gameController, "triangle", Vector2.zero, Vector2.create(playerSize, playerSize));
        this.color = "white"
        this.collidable = true;
    }

    public moveRight(){
        if(this.position.x + this.size.x >= this.gameController.mainCanvas.width){
            this.position = Vector2.create(this.gameController.mainCanvas.width - this.size.x, this.position.y)
        }
        else{
            this.position = Vector2.create(this.position.x + this.playerSpeed*this.gameController.deltaTime, this.position.y);
        }
    }
    public moveLeft(){
        if(this.position.x - this.playerSpeed < 0){
            this.position = Vector2.create(0, this.position.y)
        }
        else{
            this.position = Vector2.create(this.position.x - this.playerSpeed * this.gameController.deltaTime, this.position.y)
        }
    }

    private shot(doubleSpeed: boolean = false){
            if(this.doubleShotActive){
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                const bullet2 = this.gameController.currentScene.istantiateEl(Bullet);
                if(doubleSpeed){
                    bullet.setPowerUp();
                    bullet2.setPowerUp();
                }
                bullet.moveAtCentre(Vector2.create(this.center.x - 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet2.moveAtCentre(Vector2.create(this.center.x + 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet.setColor(this.computedColor)
                bullet2.setColor(this.computedColor)
            }
            else{
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                if(doubleSpeed){
                    bullet.setPowerUp();
                }
                bullet.moveAtCentre(Vector2.create(this.center.x,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet.setColor(this.computedColor)
            }
    }

    public enableRatioPowerUp(){
        if(!!this.bulletSpawnIntervalPtr){
            this.ratioActive = true;
            this.gameController.currentScene.clearInterval(this.bulletSpawnIntervalPtr)
            this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => this.shot(true), this.bulletRatio / 3)
            this.color = this.computedColor;

            if(!!this.removeRatioPowerUpTimeoutPtr){
                this.gameController.currentScene.clearTimeout(this.removeRatioPowerUpTimeoutPtr)
            }

            this.removeRatioPowerUpTimeoutPtr = this.gameController.currentScene.setTimeout(() => {
                if(!! this.bulletSpawnIntervalPtr){
                    this.gameController.currentScene.clearInterval(this.bulletSpawnIntervalPtr)
                    this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => this.shot(), this.bulletRatio)
                    this.ratioActive = false;
                    this.color = this.computedColor;
                }
                
            }, this.ratioPowerUpDuration);
        }
    }

    public enableDoublePowerUp(){
        if(!!this.removeDoublePowerUpTimeoutPtr){
            this.gameController.currentScene.clearTimeout(this.removeDoublePowerUpTimeoutPtr)
        }
        this.doubleShotActive = true;
        this.color = this.computedColor;
        this.removeDoublePowerUpTimeoutPtr = this.gameController.currentScene.setTimeout(() => {this.doubleShotActive = false; this.color = this.computedColor}, this.doublePowerUpDuration)
    }


  
    
}