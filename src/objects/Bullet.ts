import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "../core/GameObject.js";

export class Bullet extends GameObject{
    public onMouseClick(ev: MouseEvent): void {
    }
    public onCollisionEnter(other: GameObject): void {
        if(other instanceof Enemy){
            other.hit();
            this.destroy();
        }

    }

    private speed = 6;

    public onUpdate(): void {
        this.moveUp();
    }
    public onLoad(): void {
    }
    public onUnload(): void {
    }
    constructor(gameController: Game){
        super(gameController, "circle", Vector2.zero, Vector2.create(6,6));
        this.collidable = true;
        this.color = "white"
    }




    private moveUp(): void{
        this.position = Vector2.create(this.position.x, this.position.y - this.speed* this.gameController.deltaTime)

    }

}