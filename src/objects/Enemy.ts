import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameObject } from "../core/GameObject.js";
import { GameScene } from "../scenes/GameScene.js";

export class Enemy extends GameObject{
    public onMouseClick(ev: MouseEvent): void {

    }


    private maxHealth = 3;
    private currentHealth = this.maxHealth;

    public onCollisionEnter(other: GameObject): void {

    }
    public onUpdate(): void {
    }
    public onLoad(): void {
    }
    public onUnload(): void {
    }


    private _enemyStep: number;
    public get enemyStep(): number {return this._enemyStep};


    
    constructor(gameController: Game){
        const enemySize: Vector2 = Vector2.create(40, 20);
        super(gameController, "rectangle", Vector2.zero, enemySize);
        this._enemyStep = this.size.x + 20
        this.collidable = true;
        this.color = "white";

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
            if(this.gameController.currentScene instanceof GameScene){
                this.gameController.currentScene.incrementKillCount();
            }
            this.gameController.playAudioOneShot("explosion.wav")
            this.destroy();
        }
    }

}