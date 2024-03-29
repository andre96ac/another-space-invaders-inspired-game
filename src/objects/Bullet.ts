import { Vector2 } from "../core/Helpers/Vector2.js";
import { Enemy } from "./Enemy.js";
import { GameObject } from "../core/GameObject.js";
import { SpaceInvaders } from "../SpaceInvaders.js";

export class Bullet extends GameObject<SpaceInvaders>{
    public onMouseClick(ev: MouseEvent): void {
    }
    public onCollisionEnter(other: GameObject<SpaceInvaders>): void {
        if(other instanceof Enemy){
            other.hit(this.damage);
            this.destroy();
        }

    }

    private speed = 6;
    private _damage = 1;
    public get damage(): number {return this._damage }
    public set damage(value: number) {
        this._damage = value;

        const newSize = 4 +2*this._damage;
        this.size = Vector2.create(newSize, newSize)
    }

    public onUpdate(): void {
        this.moveUp();
    }
    public onLoad(): void {
            this.gameController.playAudioOneShot("shoot.wav")

    }
    public onUnload(): void {
    }
    constructor(gameController: SpaceInvaders){


        super(gameController, "circle", Vector2.zero, Vector2.create(6,6));
        this.collidable = true;
        this.color = "white"
        this.lineWidth = 2;
    }

    




    private moveUp(): void{
        this.position = Vector2.create(this.position.x, this.position.y - this.speed* this.gameController.deltaTime)

    }

    public setSpeed(speed: number){
        this.speed = speed;
    }

    public setColor(color: string): void{
        this.color = color;
    }

}