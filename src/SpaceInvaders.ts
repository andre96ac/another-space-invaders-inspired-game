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

        this.stdHeight = 886;
        this.stdWidth = 1000;

        this.loadAudioClips([
            "explosion.wav",
            "music.mp3",
            "shoot.wav",
            "powerup.mp3"
        ])

        this.audioLoaded.then(() => {
            this.loadScene(MenuScene);
        })
    }

    


}
