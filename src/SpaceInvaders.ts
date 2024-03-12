import { Game } from "./core/Game.js";
import { MenuScene } from "./scenes/MenuScene.js";

export class SpaceInvaders extends Game{
    public killCount = 0;

    public onPause(): void {
    }
    public onResume(): void {
    }
    public onExit(): void {
    }
    public onStart(): void {
        // @ts-ignore
        this.loadScene<SpaceInvaders>(MenuScene);
    }

}