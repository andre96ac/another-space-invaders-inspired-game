import { Game } from "../core/Game.js";
import { GameObject } from "../core/GameObject.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Player } from "./Player.js";

export class PowerUp extends GameObject{


    private speed = 2; 

    public onCollisionEnter(other: GameObject): void {
        if(other instanceof Player){
            other.enablePowerUp();
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

    constructor(gameController: Game){
        super(gameController, "circle", Vector2.zero, Vector2.create(10, 10));
        this.color = "rgb(0, 255, 153)";
        this.collidable = true;
    }

    private moveDown(){
        this.position = Vector2.create(this.position.x, this.position.y + this.speed * this.gameController.deltaTime);
    }

}