import { Scene } from "../core/Scene.js";
import { Button } from "../core/Prefabs/Button.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Text } from "../core/Prefabs/Text.js";
import { MenuScene } from "./MenuScene.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { Primitive } from "../core/Prefabs/Primitive.js";



export class DeathScene extends Scene<SpaceInvaders>{


    private storageBestKey: string = "best-score"


    public onPause(now: DOMHighResTimeStamp) {
        return super.onPause(now)
    }
    public onResume(now: DOMHighResTimeStamp) {
        return super.onResume(now)
    }
    public onUpdate(currentTimestamp: DOMHighResTimeStamp) {
        return super.onUpdate(currentTimestamp)
    }
    public onLoad() {

        const ratioX = this.gameController.currentRatio.x;
        const ratioY = this.gameController.currentRatio.y;

        this.gameController.clearContext("background")

        const bestScore: number = parseInt(localStorage.getItem(this.storageBestKey)?? "");
        const actualKillCount = this.gameController.killCount;

        const isBestScore = Number.isNaN(bestScore) || actualKillCount > bestScore

    


        const box = this.istantiateEl(Primitive)
        box.color = "rgb(102, 0, 255)"
        box.lineWidth = 4;
        box.fill = false;
        box.size = Vector2.create(this.gameController.mainCanvas.width - 20, this.gameController.mainCanvas.height - 20)
        box.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2))
        

        const button = this.istantiateEl(Button);
        button.innerText = "Main Menu";
        button.font = "Tahoma";
        button.fontSize = 30 * Math.min(ratioX, ratioY);
        button.color = "rgb(102, 0, 255)"
        button.size = Vector2.create(400 * ratioX, 50 * ratioY);
        button.lineWidth = 4;
        button.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + (isBestScore? 100*ratioY: 200* ratioY)))
        button.onMouseClick = (ev: MouseEvent) => {this.gameController.loadScene(MenuScene)}

        const title = this.istantiateEl(Text)
        title.innerText = isBestScore? "New Best!" : "You Died!";
        title.font = "Tahoma";
        title.fontSize = 90 *Math.min(ratioX, ratioY);
        title.color = "rgb(102, 0, 255)"
        title.lineWidth = 4* Math.min(ratioX, ratioY);
        title.outline = true;
        title.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 200* ratioY))
        
        const points = this.istantiateEl(Text);
        points.innerText = `${this.gameController.killCount}`;
        points.font = "Tahoma";
        points.fontSize = 120*Math.min(ratioX, ratioY);
        points.color = "rgb(102, 0, 255)"
        points.lineWidth = 4* Math.min(ratioX, ratioY);
        points.outline = true;
        points.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2- 70* ratioY))
        
        
        
        if(isBestScore){
            localStorage.setItem(this.storageBestKey, actualKillCount+'');
        }
        else{
            const best = this.istantiateEl(Text);
            best.innerText = `Best Score: ${bestScore}`;
            best.font = "Tahoma";
            best.fontSize = 70 *Math.min(ratioX, ratioY);
            best.color = "rgb(102, 0, 255)"
            best.lineWidth = 3* Math.min(ratioX, ratioY);
            best.outline = true;
            best.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2+50* ratioY))

        }
    }




    public onUnload() {
        return super.onUnload();
    }

}