import { Game } from "../Game.js";
import { GameObject, ShapeType } from "../GameObject.js";
import { Vector2 } from "../Helpers/Vector2.js";

export class Button<T extends Game> extends GameObject<T>{
    public onCollisionEnter(other: GameObject<T>): void {
    }
    public onMouseClick(ev: MouseEvent): void {
    }
    public onLoad(): void {
    }
    public onUpdate(): void {
    }
    public onUnload(): void {
    }

    private _innerText: string = "";
    public get innerText(): string{ return this._innerText }
    public set innerText(value: string){ this._innerText = value }

    private _font: string = "";
    public get font(): string{ return this._font }
    public set font(value: string){ this._font = value }

    private _fontSize: number = 20;
    public get fontSize(): number{ return this._fontSize }
    public set fontSize(value: number){ this._fontSize = value }

    public color;
    public get size(): Vector2 {
        return super.size;
    }
    public set size(value: Vector2) {
        super.size = value;
    }
    public shape: ShapeType;

    public lineWidth: number;

    public fill = false;

    public constructor(gameController: T){
        super(gameController, "rectangle", Vector2.zero, Vector2.create(20, 20));
        this.color = "blue";
        this.fill = false;
        this.lineWidth = 2;
        this.shape = "rectangle";
    }

    public render(context: CanvasRenderingContext2D){

        context.textAlign = "center"
        context.textBaseline = "middle"
        context.font = `${this.fontSize}px ${this.font}`
        context.fillText(this.innerText, this.center.x, this.center.y)

        return super.render(context);
    }

}