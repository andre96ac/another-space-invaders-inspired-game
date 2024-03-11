import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";

export class Player extends GameObject{
    public onMouseClick(ev: MouseEvent): void {
    }
    public onCollisionEnter(other: GameObject): void {
    }
    public onUpdate(): void {
    
    }
    public onLoad(): void {

    }
    public onUnload(): void {

    }



    
    private playerSpeed: number = 3;

    constructor(gameController: Game){
        const playerSize = 30;
        super(gameController, "triangle", Vector2.zero, Vector2.create(playerSize, playerSize));
        this.color = "white"
    }

    public moveRight(){
        if(this.position.x + this.size.x >= this.gameController.mainCanvas.width){
            this.position = Vector2.create(this.gameController.mainCanvas.width - this.size.x, this.position.y)
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