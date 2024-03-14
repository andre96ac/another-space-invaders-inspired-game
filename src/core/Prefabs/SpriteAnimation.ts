import { Game } from "../Game.js";
import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Helpers/Vector2.js";

export class SpriteAnimation<T extends Game> extends GameObject<T>{

    private spriteList: string[] = [];
    private currentSpriteList: string[] = [];

    public loop: boolean = false;

    private state: "running" | "stopped" = "running";

    public millisDuration: number;
    public get frameUpgradeInterval() {return this.millisDuration/this.spriteList.length}

    private lastUpdateTimestamp = 0;


    constructor(gameObject: T){
        super(gameObject, "sprite", Vector2.zero, Vector2.create(100, 100));
        this.collidable = false;
        this.millisDuration = 1000;

    }




    public onCollisionEnter(other: GameObject<T>): void {
    }
    public onLoad(): void {
    }
    public onUpdate(currentTimestamp: number): void {

        const elapsed = currentTimestamp - this.lastUpdateTimestamp;
        if(elapsed > this.frameUpgradeInterval){
            this.upgradeSource();
            this.lastUpdateTimestamp = currentTimestamp;
        }

    }
    public onUnload(): void {
    }

    private refillSprites(){
        this.currentSpriteList = [...this.spriteList]
    }

    public start(){
        this.refillSprites();
        this.state = "running";

    }

    public stop(){
        this.spriteSource = undefined;
        this.state = "stopped";
    }

    public loadAssets(spriteNames: string[]){
        this.spriteList = spriteNames;
    }


    private upgradeSource(){
        if(this.state == "running"){
            const frameName = this.currentSpriteList.shift();
            if(frameName == undefined){
                //sono alla fine
                if(this.loop){
                    //restart
                    this.start();
                }
                else{
                    this.destroy();
                }

            }
            else{
                const framePath = this.gameController.getAssetPath(frameName)
                this.spriteSource = document.createElement("img");
                this.spriteSource.src = framePath;

            }

        }
    }

}