import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "../core/GameObject.js";

export class Wall extends GameObject{
    public onCollisionEnter(other: GameObject): void {
        if(other instanceof Bullet || other instanceof Enemy){
            this.gameController.currentScene?.destroyEl(other);
        }
    }
    public onLoad(): void {
    }
    public onUnload(): void {
    }
    public onUpdate(): void {
    }

    constructor(gameController: Game){
        super(gameController, "rectangle", Vector2.zero, Vector2.create(6,6));
        this.collidable = true;
        this.hidden = false;
        this.color = "white";
        this.fill = true;
    }

    public setProperties(orientation: "horizontal" | "vertical", length: number, position: Vector2){
        const thickness = 2;
        switch(orientation){
            case "horizontal":
                this.size = Vector2.create(length, thickness);
                this.moveAtCentre(position);
                break;
                case "vertical":
                this.size = Vector2.create(thickness, length);
                this.moveAtCentre(position);
                break;
        }
    }

}