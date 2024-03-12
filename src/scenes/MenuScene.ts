import { Scene } from "../core/Scene.js";
import { Button } from "../core/Button.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameScene } from "./GameScene.js";
import { Text } from "../core/Text.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { Primitive } from "../core/Primitive.js";

export class MenuScene extends Scene<SpaceInvaders>{
    public onPause(): void {
    }
    public onResume(): void {
    }
    public onUpdate() {
        return super.onUpdate()
    }
    public onLoad() {
        this.gameController.clearContext("background")


        this.gameController.playAudioLoop("music.mp3")

        const button = this.istantiateEl(Button);
        button.innerText = "Play";
        button.font = "Tahoma";
        button.fontSize = 30;
        button.color = "rgb(102, 0, 255)"
        button.size = Vector2.create(300, 50);
        button.lineWidth = 4;
        button.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 100))
        button.onMouseClick = (ev: MouseEvent) => {this.gameController.loadScene(GameScene)}

        const title = this.istantiateEl(Text)
        title.innerText = "Space Invaders";
        title.font = "Tahoma";
        title.fontSize = 90;
        title.color = "rgb(102, 0, 255)"
        title.lineWidth = 4;
        title.outline = true;
        title.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 200))
        
        
        const box = this.istantiateEl(Primitive)
        box.color = "rgb(102, 0, 255)"
        box.lineWidth = 4;
        box.fill = false;
        box.size = Vector2.create(this.gameController.mainCanvas.width - 20, this.gameController.mainCanvas.height - 20)
        box.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2))


    }
    public onUnload() {
        return super.onUnload();
    }

}