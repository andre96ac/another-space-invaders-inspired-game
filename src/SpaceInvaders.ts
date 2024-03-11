import { Game } from "./core/Game.js";
import { GameScene } from "./scenes/GameScene.js";

export class SpaceInvaders extends Game{
    public onPause(): void {
    }
    public onResume(): void {
    }
    public onExit(): void {
    }
    public onStart(): void {
        this.loadScene(GameScene);
    }

}