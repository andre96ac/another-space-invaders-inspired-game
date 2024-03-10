import { Game } from "../Game.js";
import { Vector2 } from "../Utils/Vector2.js";
import { Bullet } from "./Bullet.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "./GameObject.js";

export class Wall extends GameObject{
    public onCollisionEnter(other: GameObject): void {
        if(other instanceof Bullet || other instanceof Enemy){
            this.gameController.currentScene?.destroyEl(other);
        }
    }
    public load(): void {
    }
    public unload(): void {
    }
    public update(): void {
    }

    constructor(gameController: Game){
        super(gameController, "rectangle", Vector2.zero, Vector2.create(6,6));
        this.collidable = true;
        this.hidden = false;
    }

    public setProperties(orientation: "horizontal" | "vertical", length: number, position: Vector2){
        const thickness = 5;
        switch(orientation){
            case "horizontal":
                this._size = Vector2.create(length, thickness);
                this.moveAtCentre(position);
                break;
                case "vertical":
                this._size = Vector2.create(thickness, length);
                this.moveAtCentre(position);
                break;
        }
    }

}