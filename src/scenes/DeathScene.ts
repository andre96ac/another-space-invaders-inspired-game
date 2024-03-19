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
        button.fontSize = 30;
        button.color = "rgb(102, 0, 255)"
        button.size = Vector2.create(400, 50);
        button.lineWidth = 4;
        button.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2 + (isBestScore? 100 : 200)))
        button.onMouseClick = (ev: MouseEvent) => {this.gameController.loadScene(MenuScene)}

        const title = this.istantiateEl(Text)
        title.innerText = isBestScore? "New Best!" : "You Died!";
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
        
        
        
        if(isBestScore){
            localStorage.setItem(this.storageBestKey, actualKillCount+'');
        }
        else{
            const best = this.istantiateEl(Text);
            best.innerText = `Best Score: ${bestScore}`;
            best.font = "Tahoma";
            best.fontSize = 70;
            best.color = "rgb(102, 0, 255)"
            best.lineWidth = 3;
            best.outline = true;
            best.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2+50))

        }
    }




    public onUnload() {
        return super.onUnload();
    }

}