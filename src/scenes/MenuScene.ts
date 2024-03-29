import { Scene } from "../core/Scene.js";
import { Button } from "../core/Prefabs/Button.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { GameScene } from "./GameScene.js";
import { Text } from "../core/Prefabs/Text.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { Primitive } from "../core/Prefabs/Primitive.js";

export class MenuScene extends Scene<SpaceInvaders>{
    public onPause(now: DOMHighResTimeStamp) {
        return super.onPause(now)
    }
    public onResume(now: DOMHighResTimeStamp) {
        return super.onResume(now)
    }
    public onUpdate(timestamp: DOMHighResTimeStamp) {
        return super.onUpdate(timestamp)
    }
    public onLoad() {

        const ratioX = this.gameController.currentRatio.x;
        const ratioY = this.gameController.currentRatio.y;


        this.gameController.clearContext("background")


        this.gameController.playAudioLoop("music.mp3")

        const button1 = this.istantiateEl(Button);
        button1.innerText = "1 Player";
        button1.font = "Tahoma";
        button1.fontSize = 30* Math.min(ratioX, ratioY);
        button1.color = "rgb(102, 0, 255)"
        button1.size = Vector2.create(400* ratioX, 100* ratioY);
        button1.lineWidth = 4 ;
        button1.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 50*ratioY))
        button1.onMouseClick = (ev: MouseEvent) => {this.gameController.playerNumber = 1; this.gameController.loadScene(GameScene)}


        const button2 = this.istantiateEl(Button);
        button2.innerText = "2 Players";
        button2.font = "Tahoma";
        button2.fontSize = 30* Math.min(ratioX, ratioY);
        button2.color = "rgb(102, 0, 255)"
        button2.size = Vector2.create(300 * ratioX, 50 * ratioY);
        button2.lineWidth = 4;
        button2.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 200 * ratioY))
        button2.onMouseClick = (ev: MouseEvent) => {this.gameController.playerNumber = 2; this.gameController.loadScene(GameScene)}

        const title = this.istantiateEl(Text)
        title.innerText = "Space Invaders";
        title.font = "Tahoma";
        title.fontSize = 90* Math.min(ratioX, ratioY);
        title.color = "rgb(102, 0, 255)"
        title.lineWidth = 4 * Math.min(ratioX, ratioY);
        title.outline = true;
        title.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 150 * ratioY))
        
        
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