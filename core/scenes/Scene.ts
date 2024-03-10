import { Game } from "../Game.js";
import { GameObject } from "../objects/GameObject.js";

export abstract class Scene{

    private static CallSuper = Symbol("calling super is mandatory");

    private gameObjList: GameObject[] = [];
    protected gameController: Game;

    public abstract load(): void;
    public abstract unload(): void;


    public get arCollidables(): GameObject[]{
        return this.gameObjList.filter(el => el.collidable)
    }

    public update(){
        this.gameObjList.forEach(gameObj => gameObj.update())
        return Scene.CallSuper;
    }

    constructor(gameController: Game){
        this.gameController = gameController;
    }



    public istantiateEl<T extends GameObject>(Factory: new (gameController: Game)=>T): T{
        const instance: T = new Factory(this.gameController)
        instance.load();
        this.gameObjList.push(instance);
        return instance;
    }

    public destroyEl(gameObj: GameObject): void{
        const idx = this.gameObjList.findIndex(el => el == gameObj)
        this.gameObjList[idx].unload();
        this.gameObjList.splice(idx, 1);
    }

    public render(){
        this.gameController.mainContext.clearRect(0, 0, this.gameController.mainCanvas.width, this.gameController.mainCanvas.height)
        this.gameObjList.forEach(el => el.render(this.gameController.mainContext))
    }


    public checkCollisions(){
    


        for (let idx = 0; idx < this.arCollidables.length; idx++) {
            for (let counter = idx+1; counter < this.arCollidables.length; counter++) {
                if (this.areColliding(this.arCollidables[idx], this.arCollidables[counter])){
                    this.arCollidables[idx]?.onCollisionEnter(this.arCollidables[counter]);
                    this.arCollidables[counter]?.onCollisionEnter(this.arCollidables[idx]);
                }
            }
        }

        
    }

    private areColliding(el: GameObject, el2: GameObject):boolean {
        // const areCollidingX: boolean = el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x; 
        // const areCollidingX: boolean = 
         return (el.position.y < el2.position.y? (el2.position.y - el.position.y) < el.size.y : (el.position.y - el2.position.y) < el2.size.y)
         && (el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x)
    }

    

    
}