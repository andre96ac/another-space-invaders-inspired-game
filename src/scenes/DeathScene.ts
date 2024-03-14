import { Scene } from "../core/Scene.js";
import { Button } from "../core/Prefabs/Button.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Text } from "../core/Prefabs/Text.js";
import { MenuScene } from "./MenuScene.js";
import { SpaceInvaders } from "../SpaceInvaders.js";

export class DeathScene extends Scene<SpaceInvaders>{
    public onPause(): void {
    }
    public onResume(): void {
    }
    public onUpdate(currentTimestamp: DOMHighResTimeStamp) {
        return super.onUpdate(currentTimestamp)
    }
    public onLoad() {


        const button = this.istantiateEl(Button);
        button.innerText = "Main Menu";
        button.font = "Tahoma";
        button.fontSize = 30;
        button.color = "rgb(102, 0, 255)"
        button.size = Vector2.create(300, 50);
        button.lineWidth = 4;
        button.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + 100))
        button.onMouseClick = (ev: MouseEvent) => {this.gameController.loadScene(MenuScene)}

        const title = this.istantiateEl(Text)
        title.innerText = "You Died!";
        title.font = "Tahoma";
        title.fontSize = 90;
        title.color = "rgb(102, 0, 255)"
        title.lineWidth = 4;
        title.outline = true;
        title.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 200))
        
        const points = this.istantiateEl(Text);
        points.innerText = `${this.gameController.killCount}`;
        points.font = "Tahoma";
        points.fontSize = 120;
        points.color = "rgb(102, 0, 255)"
        points.lineWidth = 4;
        points.outline = true;
        points.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 70))
        
    }
    public onUnload() {
        return super.onUnload();
    }

}