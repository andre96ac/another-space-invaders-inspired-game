import { Game } from "../Game.js";
import { Vector2 } from "../Utils/Vector2.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "./GameObject.js";

export class Bullet extends GameObject{
    public onCollisionEnter(other: GameObject): void {
        if(other instanceof Enemy){
            other.hit();
            this.destroy();
        }

    }

    private speed = 6;

    public update(): void {
        this.moveUp();
    }
    public load(): void {
    }
    public unload(): void {
    }
    constructor(gameController: Game){
        super(gameController, "circle", Vector2.zero, Vector2.create(6,6));
        this.collidable = true;
    }




    private moveUp(): void{
        this.position = Vector2.create(this.position.x, this.position.y - this.speed* this.gameController.deltaTime)

    }

}