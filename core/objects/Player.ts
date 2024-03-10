import { Game } from "../Game.js";
import { Vector2 } from "../Utils/Vector2.js";
import { GameObject } from "./GameObject.js";

export class Player extends GameObject{
    public onCollisionEnter(other: GameObject): void {
    }
    public update(): void {
    
    }
    public load(): void {

    }
    public unload(): void {

    }



    
    private playerSpeed: number = 3;

    constructor(gameController: Game){
        const playerSize = 30;
        super(gameController, "rectangle", Vector2.zero, Vector2.create(playerSize, playerSize));
    }

    public moveRight(){
        if(this.position.x + this._size.x >= this.gameController.mainCanvas.width){
            this.position = Vector2.create(this.gameController.mainCanvas.width - this._size.x, this.position.y)
        }
        else{
            this.position = Vector2.create(this.position.x + this.playerSpeed*this.gameController.deltaTime, this.position.y);
        }
    }
    public moveLeft(){
        if(this.position.x - this.playerSpeed < 0){
            this.position = Vector2.create(0, this.position.y)
        }
        else{
            this.position = Vector2.create(this.position.x - this.playerSpeed * this.gameController.deltaTime, this.position.y)
        }
    }
    
}