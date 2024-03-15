import { SpaceInvaders } from "../SpaceInvaders.js";
import { GameObject } from "../core/GameObject.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Player } from "./Player.js";

export class DoublePowerUp extends GameObject<SpaceInvaders>{


    private speed = 2; 

    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
        if(other instanceof Player){
            other.enableDoublePowerUp();
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
        this.color = "rgb(255, 255, 0)";
        this.collidable = true;
    }

    private moveDown(){
        this.position = Vector2.create(this.position.x, this.position.y + this.speed * this.gameController.deltaTime);
    }

}