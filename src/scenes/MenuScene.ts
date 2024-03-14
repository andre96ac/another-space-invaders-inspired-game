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
    public onUpdate(timestamp: DOMHighResTimeStamp) {
        return super.onUpdate(timestamp)
    }
    public onLoad() {
        this.gameController.clearContext("background")


        this.gameController.playAudioLoop("music.mp3")

        const button1 = this.istantiateEl(Button);
        button1.innerText = "1 Player";
        button1.font = "Tahoma";
        button1.fontSize = 30;
        button1.color = "rgb(102, 0, 255)"
        button1.size = Vector2.create(400, 100);
        button1.lineWidth = 4;
        button1.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 50))
        button1.onMouseClick = (ev: MouseEvent) => {this.gameController.playerNumber = 1; this.gameController.loadScene(GameScene)}


        const button2 = this.istantiateEl(Button);
        button2.innerText = "2 Players";
        button2.font = "Tahoma";
        button2.fontSize = 30;
        button2.color = "rgb(102, 0, 255)"
        button2.size = Vector2.create(300, 50);
        button2.lineWidth = 4;
        button2.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 200))
        button2.onMouseClick = (ev: MouseEvent) => {this.gameController.playerNumber = 2; this.gameController.loadScene(GameScene)}

        const title = this.istantiateEl(Text)
        title.innerText = "Space Invaders";
        title.font = "Tahoma";
        title.fontSize = 90;
        title.color = "rgb(102, 0, 255)"
        title.lineWidth = 4;
        title.outline = true;
        title.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 150))
        
        
        const box = this.istantiateEl(Primitive)
        box.color = "rgb(102, 0, 255)"
        box.lineWidth = 4;
        box.fill = false;
        box.size = Vector2.create(this.gameController.mainCanvas.width - 20, this.gameController.mainCanvas.height - 20)
        box.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2))


        this.addEventListener(document, "keydown", (ev) => console.log(ev.key))
    }
    public onUnload() {
        return super.onUnload();
    }

}