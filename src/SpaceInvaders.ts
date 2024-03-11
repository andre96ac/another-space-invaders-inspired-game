import { Game } from "./core/Game.js";
import { GameScene } from "./scenes/GameScene.js";

export class SpaceInvaders extends Game{
    public onPause(): void {
        console.log("Game paused")
        
    }
    public onResume(): void {
        console.log("Game resumed")
    }
    public onExit(): void {
        console.log("Game exited")
    }
    public onStart(): void {
        this.loadScene(GameScene);
    }

}