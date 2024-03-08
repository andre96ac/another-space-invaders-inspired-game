import { Game } from "../Game.js";

export class GameObject{
    private shape: "circle" | "rectangle";
    protected _position: Vector2;
    protected _size: Vector2;
    protected gameController: Game;

    public get position(): Vector2{
        return  this._position;
    }
    public get size(): Vector2{
        return  this._size;
    }

    constructor(gameController: Game, shape: ShapeType = "rectangle", position: Vector2 = {x: 0, y: 0}, size: Vector2 = {x: 0, y: 0}){
        this.shape = shape;
        this._position = position;
        this._size = size;
        this.gameController = gameController;
    }

    public render(context: CanvasRenderingContext2D): void{
        context.beginPath();
        switch (this.shape){
            case "circle":
                    context.ellipse(this._position.x, this._position.y, this._size.x, this._size.y, 0, 0, 0)
                break;
            case "rectangle":
                    context.rect(this._position.x, this._position.y, this._size.x, this._size.y);
                break;
        }
        context.fill();
    }
}

export type ShapeType = "circle" | "rectangle";
export type Vector2 = {x: number, y: number};
