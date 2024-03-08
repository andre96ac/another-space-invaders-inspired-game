import { Game } from "../Game.js";
import { GameObject } from "./GameObject.js";

export class Player extends GameObject{

    
    private playerSpeed: number = 5;

    constructor(gameController: Game){
        const playerSize = 20;
        super(gameController, "rectangle", {x:gameController.mainCanvas.clientWidth/2, y:gameController.mainCanvas.clientHeight - playerSize}, {x: playerSize, y:playerSize});
    }

    public moveRight(){
        if(this._position.x + this._size.x >= this.gameController.mainCanvas.width){
            this._position.x = this.gameController.mainCanvas.width - this._size.x;
        }
        else{
            this._position.x += this.playerSpeed;
        }
    }
    public moveLeft(){
        if(this._position.x - this.playerSpeed < 0){
            this._position.x = 0
        }
        else{
            this._position.x -= this.playerSpeed;
        }
    }
}