import { Game } from "../Game.js";
import { GameObject, ShapeType } from "../GameObject.js";
import { Vector2 } from "../Helpers/Vector2.js";

export class Text<T extends Game> extends GameObject<T>{
    public onCollisionEnter(other: GameObject<T>): void {
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

    public lineWidth: number;

    public outline: boolean = false;

    public constructor(gameController: T){
        super(gameController, "custom");
        this.color = "blue";
        this.lineWidth = 2;
    }

    public render(context: CanvasRenderingContext2D){

        context.beginPath();
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.font = `${this.fontSize}px ${this.font}`
        context.lineWidth = this.lineWidth;
        if(this.outline){
            context.strokeText(this.innerText, this.position.x, this.position.y)
        }
        else{
            context.fillText(this.innerText, this.position.x, this.position.y)
        }

        return super.render(context);

    }

    public moveAtCentre(position: Vector2): void {
        this.position = Vector2.copy(position);    
    }

}