import { SpaceInvaders } from "../SpaceInvaders.js";
import { GameObject } from "../core/GameObject.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Player } from "./Player.js";

export class DamagePowerUp extends GameObject<SpaceInvaders>{


    private speed = 2; 

    private duration: number = 10000;

    private increaseOf: number = 1;
    private maxDamage: number = 3

    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
        if(other instanceof Player){

            const newValue = other.damage + this.increaseOf;
        
            if(newValue <= this.maxDamage){
                other.arShotDamageTimeouts.forEach(el => el.changeDelay(el.delay + this.duration))
                other.damage = newValue;
                other.arShotDamageTimeouts.push(this.gameController.currentScene.setTimeout(() => other.damage -= this.increaseOf, this.duration))
            }
            else{
                other.arShotDamageTimeouts.forEach(el => this.gameController.currentScene.resetTimeout(el))
            }


            // other.enableMultiShotPowerUp(1, this.duration);
            this.gameController.playAudioOneShot("powerup.mp3")
            this.destroy();

        }
        
    }

    public onLoad(): void {
    }
    public onUpdate(): void {
        this.moveDown();
    }
    public onUnload(): void {
    }

    constructor(gameController: SpaceInvaders){
        super(gameController, "circle", Vector2.zero, Vector2.create(10, 10));
        this.color = "red";
        this.collidable = true;
    }

    private moveDown(){
        this.position = Vector2.create(this.position.x, this.position.y + this.speed * this.gameController.deltaTime);
    }

}