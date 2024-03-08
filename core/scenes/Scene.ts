import { Game } from "../Game.js";
import { GameObject } from "../objects/GameObject.js";

export abstract class Scene{

    private gameObjList: GameObject[] = [];
    protected gameController: Game;

    public abstract load():void;
    public abstract unload():void;
    public abstract update(): void;

    constructor(gameController: Game){
        this.gameController = gameController;
    }



    protected istantiateEl<T extends GameObject>(Factory: new (gameController: Game)=>T): T{
        const instance: T = new Factory(this.gameController)
        this.gameObjList.push(instance);
        return instance;
    }

    protected destroyEl(gameObj: GameObject): void{
        const idx = this.gameObjList.findIndex(el => el == gameObj)
        this.gameObjList.splice(idx, 1);
    }

    public render(){
        this.gameController.mainContext.clearRect(0, 0, this.gameController.mainCanvas.width, this.gameController.mainCanvas.height)
        this.gameObjList.forEach(el => el.render(this.gameController.mainContext))
    }
}