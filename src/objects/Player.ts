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

    private startHeight: number = 0;

    private isJumpingUp:boolean = false;
    private isJumping: boolean = false;

    private jumpHeightTime: number = 200 ;
    private jumpSpeed: number = 3;

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

        if(this.isJumpingUp){
            this.position = Vector2.create(this.position.x, this.position.y - this.jumpSpeed * this.gameController.deltaTime)
        }

        else if(this.center.y < this.startHeight){
            this.position = Vector2.create(this.position.x, this.position.y + this.jumpSpeed * this.gameController.deltaTime)
        }
        else{
            this.isJumping = false;
        }

    
    }
    public onLoad(): void {

                //faccio partire il timer degli spari
                this.bulletSpawnIntervalPtr = this.gameController.currentScene.setInterval(() => {
                   this.shot();
                }, this.bulletRatio)

    }
    public onUnload(): void {
    }

    public moveAtCentre(position: Vector2): void {
        this.startHeight = position.y;
        super.moveAtCentre(position)
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

    private shot(){
            if(this.doubleShotActive && this.ratioActive){
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                const bullet2 = this.gameController.currentScene.istantiateEl(Bullet);
                const bullet3 = this.gameController.currentScene.istantiateEl(Bullet);
                const bullet4 = this.gameController.currentScene.istantiateEl(Bullet);

                bullet.setPowerUp();
                bullet2.setPowerUp();
                bullet3.setPowerUp();
                bullet4.setPowerUp();
                
                bullet.moveAtCentre(Vector2.create(this.center.x - 15,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet3.moveAtCentre(Vector2.create(this.center.x - 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet2.moveAtCentre(Vector2.create(this.center.x + 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet4.moveAtCentre(Vector2.create(this.center.x + 15,  this.center.y - this.size.y/2 - bullet.size.y/2));
                
                bullet.setColor(this.computedColor)
                bullet2.setColor(this.computedColor)
                bullet3.setColor(this.computedColor)
                bullet4.setColor(this.computedColor)
            }
            else if(this.doubleShotActive){
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                const bullet2 = this.gameController.currentScene.istantiateEl(Bullet);
                
                bullet.moveAtCentre(Vector2.create(this.center.x - 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet2.moveAtCentre(Vector2.create(this.center.x + 5,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet.setColor(this.computedColor)
                bullet2.setColor(this.computedColor)
            }
            else{
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                if(this.ratioActive){
                    bullet.setPowerUp();
                }
                bullet.moveAtCentre(Vector2.create(this.center.x,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet.setColor(this.computedColor)
            }
    }

    public enableRatioPowerUp(){


        this.ratioActive = true;
        this.bulletSpawnIntervalPtr?.changeDelay(this.bulletRatio / 3)
        this.color = this.computedColor;

        if(!!this.removeRatioPowerUpTimeoutPtr){
            this.gameController.currentScene.clearTimeout(this.removeRatioPowerUpTimeoutPtr)
        }

        this.removeRatioPowerUpTimeoutPtr = this.gameController.currentScene.setTimeout(() => {

            this.bulletSpawnIntervalPtr?.changeDelay(this.bulletRatio);
            this.ratioActive = false;
            this.color = this.computedColor;
            
        }, this.ratioPowerUpDuration);

    }

    public enableDoublePowerUp(){
        if(!!this.removeDoublePowerUpTimeoutPtr){
            this.gameController.currentScene.clearTimeout(this.removeDoublePowerUpTimeoutPtr)
        }
        this.removeDoublePowerUpTimeoutPtr = this.gameController.currentScene.setTimeout(() => {this.doubleShotActive = false; this.color = this.computedColor}, this.doublePowerUpDuration)
        
        this.doubleShotActive = true;
        this.color = this.computedColor;
    }


    public jump(){
        if(!this.isJumping){
            this.isJumpingUp = true;
            this.isJumping = true;
            this.gameController.currentScene.setTimeout(() => this.isJumpingUp = false, this.jumpHeightTime)
        }
    }


  
    
}