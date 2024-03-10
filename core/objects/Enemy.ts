import { Game } from "../Game.js";
import { Vector2 } from "../Utils/Vector2.js";
import { GameObject } from "./GameObject.js";

export class Enemy extends GameObject{


    private maxHealth = 3;
    private currentHealth = this.maxHealth;

    public onCollisionEnter(other: GameObject): void {

    }
    public update(): void {
    }
    public load(): void {
    }
    public unload(): void {
    }


    private _enemyStep: number;
    public get enemyStep(): number {return this._enemyStep};


    
    constructor(gameController: Game){
        const enemySize: Vector2 = Vector2.create(40, 20);
        super(gameController, "rectangle", Vector2.zero, enemySize);
        this._enemyStep = this.size.x + 20
        this.collidable = true;

    }

    public moveDown(_this: Enemy): void{
        if(_this.position.y + _this.size.y + _this.enemyStep < _this.gameController.mainContext.canvas.height){
            _this.position = Vector2.create(_this.position.x, _this.position.y + _this.enemyStep)
        }
        else{
            _this.position =Vector2.create(_this.position.x, _this.gameController.mainCanvas.height - _this.size.y)
        }
    }

    public hit(){
        if(this.currentHealth > 0){
            this.currentHealth --;
        }
        else{
            this.destroy();
        }
    }

}