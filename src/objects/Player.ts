import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { Bullet } from "./Bullet.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { ScheduledInterval, ScheduledTask, ScheduledTimeout } from "../core/Helpers/ScheduledTask.js";

export class Player extends GameObject<SpaceInvaders>{


 

    //bullet spawn interval
    private bulletSpawnIntervalPtr: undefined | ScheduledInterval;

    private startHeight: number = 0;

    private isJumpingUp:boolean = false;
    private isJumping: boolean = false;

    private jumpHeightTime: number = 200 ;
    private jumpSpeed: number = 3;


    
    public readonly arShotRatioTimeouts: ScheduledTimeout[] = [];
    private _shotRatio : number = 300;
    public get shotRatio() : number {
        return this._shotRatio;
    }
    public set shotRatio(value: number){
        if(value > 0){
            this._shotRatio = value;
            this.bulletSpawnIntervalPtr?.changeDelay(this._shotRatio)
        }

    }



    private _shotSpeed : number = 6;
    public get shotSpeed() : number {
        return this._shotSpeed;
    }
    public set shotSpeed(v : number) {
        this._shotSpeed = v;
    }
    


    public readonly arShotNumberTimeouts: ScheduledTimeout[] = [];
    private _shotNumber : number = 1;
    public get shotNumber() : number {
        return this._shotNumber;
    }

    public set shotNumber(value: number){

        this._shotNumber = value;
    } 

    
    public readonly arShotDamageTimeouts: ScheduledTimeout[] = [];
    private _damage : number = 1;
    public get damage() : number {
        return this._damage;
    }

    public set damage(value: number){

        this._damage = value;
    } 
    

    
    private _playerSpeed : number = 3;
    public get playerSpeed() : number {
        return this._playerSpeed;
    }
    public set playerSpeed(v : number) {
        this._playerSpeed = v;
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
                }, this.shotRatio)

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
        this.lineWidth = 2;
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
        for(let i = 0; i<this.shotNumber; i++){
                const bullet = this.gameController.currentScene.istantiateEl(Bullet);
                bullet.damage = this.damage;
                const bulletsSpace = bullet.size.x - 1;
                bullet.setSpeed(this.shotSpeed);
                const bulletOffsetX = this.shotNumber%2 == 0? (-(bulletsSpace * (this.shotNumber - 1)) + bulletsSpace * 2 * i) : (-((this.shotNumber - 1) * bulletsSpace) + bulletsSpace * 2 * i)
                bullet.moveAtCentre(Vector2.create(this.center.x - bulletOffsetX,  this.center.y - this.size.y/2 - bullet.size.y/2));
                bullet.setColor(this.color);
                bullet.setSpeed(this.shotSpeed);

            }

    }



    public jump(){
        if(!this.isJumping){
            this.isJumpingUp = true;
            this.isJumping = true;
            this.gameController.currentScene.setTimeout(() => this.isJumpingUp = false, this.jumpHeightTime)
        }
    }

    public setColor(color: string){
        this.color = color;
    }


  
    
}