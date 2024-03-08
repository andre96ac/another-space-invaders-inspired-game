import { Game } from "../Game.js";
import { GameObject, Vector2 } from "./GameObject.js";

export class Enemy extends GameObject{


    private _enemyStep: number;
    public get enemyStep(): number {return this._enemyStep};


    
    constructor(gameController: Game){
        const enemySize: Vector2 = {x: 10, y: 20};
        super(gameController, "rectangle", {x: 0, y: 0}, enemySize);
        this._enemyStep = this.size.x + 20

    }

    public moveDown(_this: Enemy): void{
        if(_this._position.y + _this.size.y + _this.enemyStep < _this.gameController.mainContext.canvas.height){
            _this._position.y += _this.enemyStep;
        }
        else{
            _this.position.y = _this.gameController.mainCanvas.height - _this.size.y
        }
    }

    public moveAt(position: Vector2): void{
        this._position = position;
    }
}