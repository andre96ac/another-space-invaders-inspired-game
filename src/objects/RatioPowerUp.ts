import { SpaceInvaders } from "../SpaceInvaders.js";
import { Game } from "../core/Game.js";
import { GameObject } from "../core/GameObject.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Player } from "./Player.js";

export class RatioPowerUp extends GameObject<SpaceInvaders>{


    private speed = 2; 
    private shotRatioDecreaseMillis = 60;
    private minShotRatioMillis = 100;
    private duration: number = 10000;

    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
        if(other instanceof Player){


            let newValue = other.shotRatio - this.shotRatioDecreaseMillis

        
            if(newValue >= this.minShotRatioMillis){
                other.arShotRatioTimeouts.forEach(el => el.changeDelay(el.delay + this.duration))
                other.shotRatio = newValue;
                other.arShotRatioTimeouts.push(this.gameController.currentScene.setTimeout(() => {other.shotRatio += this.shotRatioDecreaseMillis}, this.duration))
            }
            else if(other.shotRatio > this.minShotRatioMillis){
                const delta = other.shotRatio - this.minShotRatioMillis;
                newValue = this.minShotRatioMillis;
                other.arShotRatioTimeouts.forEach(el => el.changeDelay(el.delay + this.duration))
                other.shotRatio = newValue;
                other.arShotRatioTimeouts.push(this.gameController.currentScene.setTimeout(() => {other.shotRatio += delta}, this.duration))
            }
            else{
                other.arShotRatioTimeouts.forEach(el => this.gameController.currentScene.resetTimeout(el))
            }


            // other.enableRatioPowerUp(this.shotDecreaseDelay, this.duration)
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
        this.color = "rgb(0, 255, 153)";
        this.collidable = true;
    }

    private moveDown(){
        this.position = Vector2.create(this.position.x, this.position.y + this.speed * this.gameController.deltaTime);
    }

}