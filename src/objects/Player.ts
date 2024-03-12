import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { Bullet } from "./Bullet.js";

export class Player extends GameObject{


    //delay di spawn dei proiettili
    private bulletRatio: number = 300;

    //bullet spawn interval
    private bulletSpawnIntervalPtr: undefined | number;

    //Player Speed
    private playerSpeed: number = 3;

    private powerUpDuration: number = 10000;

    private removePowerUpTimeoutPtr : undefined | number;

    public onCollisionEnter(other: GameObject): void {
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


    constructor(gameController: Game){
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
        if(!this.gameController.paused){
            const bullet = this.gameController.currentScene?.istantiateEl(Bullet);
            if(doubleSpeed){
                bullet?.setPowerUp();
            }
            bullet?.moveAtCentre(Vector2.create(this.center.x,  this.center.y - this.size.y/2 - bullet.size.y/2));
            this.gameController.playAudioOneShot("shoot.wav")
        }
    }

    public enablePowerUp(){
        if(!!this.bulletSpawnIntervalPtr){
            clearInterval(this.bulletSpawnIntervalPtr)
            this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => this.shot(true), this.bulletRatio / 3)
            this.color = "rgb(0, 255, 153)";

            if(!!this.removePowerUpTimeoutPtr){
                clearTimeout(this.removePowerUpTimeoutPtr)
            }

            this.removePowerUpTimeoutPtr = this.gameController.currentScene?.setTimeout(() => {
                if(!! this.bulletSpawnIntervalPtr){
                    clearInterval(this.bulletSpawnIntervalPtr)
                    this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => this.shot(), this.bulletRatio)
                    this.color = "white";
                }
                
            }, this.powerUpDuration);
        }
    }
    
}