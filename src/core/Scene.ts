import { Button } from "./Button.js";
import { Game } from "./Game.js";
import { GameObject } from "./GameObject.js";

export abstract class Scene<T extends Game>{


    //Loaded GameObject list
    private gameObjList: GameObject[] = [];

    //reference to the gameController
    protected readonly gameController: T;

    //Array with collidables gameObjects
    public get arCollidables(): GameObject[]{
        return this.gameObjList.filter(el => el.collidable)
    }

    public get arButtons(): Button[]{
        return this.gameObjList.filter(el => el instanceof Button) as Button[];
    }

   




    constructor(gameController: T){
        this.gameController = gameController;
    }



    /**
     * Create element into the scene
     * @param Factory 
     * @returns 
     */
    public istantiateEl<T extends GameObject>(Factory: new (gameController: Game)=>T): T{
        const instance: T = new Factory(this.gameController)
        instance.onLoad();
        this.gameObjList.push(instance);
        return instance;
    }


    /**
     * Remove gameObject from rendering array (elemnet will be destroyed if no other references are present)
     * @param gameObj gameObject to remove
     * @returns 
     */
    public destroyEl(gameObj: GameObject): Symbol{
        const idx = this.gameObjList.findIndex(el => el == gameObj)
        this.gameObjList[idx].onUnload();
        this.gameObjList.splice(idx, 1);
        return Symbol("calling super is mandatory")
    }

    /**
     * Main method to draw a scene frame (clear canvas and draw, all the elements into scene)(called in every frame)
     * @param context 
     */
    public render(){
        this.gameObjList.forEach(el => el.render(this.gameController.mainContext))
        return Symbol("this mehtod is called in Game render pipeline and should not be overrided, use update instead")
    }
    
    /**
     * called in every frame; this method check the collision between all collidables and notify the properly event to the objects
     * @returns 
     */
    public checkCollisions(){
        for (let idx = 0; idx < this.arCollidables.length; idx++) {
            for (let counter = idx+1; counter < this.arCollidables.length; counter++) {
                if (this.areColliding(this.arCollidables[idx], this.arCollidables[counter])){
                    this.arCollidables[idx]?.onCollisionEnter(this.arCollidables[counter]);
                    this.arCollidables[counter]?.onCollisionEnter(this.arCollidables[idx]);
                }
            }
        }
        
        return Symbol("this mehtod is called in Game render pipeline and should not be overrided, use update instead")
        
    }

    /**
     * Tell if el and el2 are overlapping on the screen
     * @param el 
     * @param el2 
     * @returns 
     */
    private areColliding(el: GameObject, el2: GameObject):boolean {
         return (el.position.y < el2.position.y? (el2.position.y - el.position.y) < el.size.y : (el.position.y - el2.position.y) < el2.size.y)
         && (el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x)
    }


    /**
     * called when a mouse click event is called; notify OnMouseClick event to gameObject overlapping pointer
     */
    public checkButtonClick(ev: MouseEvent): Symbol{
        this.arButtons
                        .filter(button => (ev.offsetX > button.position.x && ev.offsetX < button.position.x + button.size.x)&&(ev.offsetY > button.position.y && ev.offsetY < button.position.y + button.size.y))
                        .forEach(el => el.onMouseClick(ev))
        return Symbol("this method should not be overriden");
    }






    //#region Events

    /**
     * Called when the game pause
     */
    public abstract onPause(): void

    /**
     * Called when the game resume from pause
     */
    public abstract onResume(): void

    /**
     * Called once at scene loading
     */
    public abstract onLoad(): void;

    /**
     * Called once at scene unloading
     */
    public onUnload(): Symbol{
        this.gameObjList.forEach(el => el.destroy())
        return Symbol("Calling super is mandatory")
    };

    /**
     * Called every frame update
     */
    public onUpdate(){
        // Call update for every object
        this.gameObjList.forEach(gameObj => gameObj.onUpdate())
        return Symbol("calling super is mandatory");
    }

    //#endregion
    

    
}