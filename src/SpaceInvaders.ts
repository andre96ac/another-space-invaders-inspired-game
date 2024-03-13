import { Game } from "./core/Game.js";
import { MenuScene } from "./scenes/MenuScene.js";

export class SpaceInvaders extends Game{
    public killCount = 0;

    public playerNumber = 1;

    public onPause(): void {
    }
    public onResume(): void {
    }
    public onExit(): void {
    }
    public onStart(): void {
        this.audioLoaded.then(() => {
            this.loadScene(MenuScene);
        })
    }

    


}

export class Game2 extends Game{
    public onStart(): void {
        throw new Error("Method not implemented.");
    }
    public onPause(): void {
        throw new Error("Method not implemented.");
    }
    public onResume(): void {
        throw new Error("Method not implemented.");
    }
    public onExit(): void {
        throw new Error("Method not implemented.");
    }

    public myMethod(): boolean{
        return true;
    
    }

    

}
