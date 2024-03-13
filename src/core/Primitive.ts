import { Game } from "./Game.js";
import { GameObject, ShapeType } from "./GameObject.js";
import { Vector2 } from "./Helpers/Vector2.js";

export class Primitive<T extends Game> extends GameObject<T>{
    public onCollisionEnter(other: GameObject<T>): void {
    }
    public onLoad(): void {
    }
    public onUpdate(): void {
    }
    public onUnload(): void {
    }

    public shape: ShapeType;
    public color: string;
    public fill: boolean;
    public lineWidth: number;
    
    public get size(): Vector2 {
        return super.size;
    }
    public set size(value: Vector2) {
        super.size = value;
    }


    public constructor(gameController: T){
        super(gameController, "rectangle", Vector2.zero, Vector2.create(20, 20));
        this.color = "blue";
        this.fill = false;
        this.lineWidth = 2;
        this.shape = "rectangle";
    }
}