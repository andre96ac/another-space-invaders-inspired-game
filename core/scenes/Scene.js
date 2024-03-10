export class Scene {
    static CallSuper = Symbol("calling super is mandatory");
    gameObjList = [];
    gameController;
    get arCollidables() {
        return this.gameObjList.filter(el => el.collidable);
    }
    update() {
        this.gameObjList.forEach(gameObj => gameObj.update());
        return Scene.CallSuper;
    }
    constructor(gameController) {
        this.gameController = gameController;
    }
    istantiateEl(Factory) {
        const instance = new Factory(this.gameController);
        instance.load();
        this.gameObjList.push(instance);
        return instance;
    }
    destroyEl(gameObj) {
        const idx = this.gameObjList.findIndex(el => el == gameObj);
        this.gameObjList[idx].unload();
        this.gameObjList.splice(idx, 1);
    }
    render() {
        this.gameController.mainContext.clearRect(0, 0, this.gameController.mainCanvas.width, this.gameController.mainCanvas.height);
        this.gameObjList.forEach(el => el.render(this.gameController.mainContext));
    }
    checkCollisions() {
        for (let idx = 0; idx < this.arCollidables.length; idx++) {
            for (let counter = idx + 1; counter < this.arCollidables.length; counter++) {
                if (this.areColliding(this.arCollidables[idx], this.arCollidables[counter])) {
                    this.arCollidables[idx]?.onCollisionEnter(this.arCollidables[counter]);
                    this.arCollidables[counter]?.onCollisionEnter(this.arCollidables[idx]);
                }
            }
        }
    }
    areColliding(el, el2) {
        // const areCollidingX: boolean = el.position.x < el2.position.x? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x; 
        // const areCollidingX: boolean = 
        return (el.position.y < el2.position.y ? (el2.position.y - el.position.y) < el.size.y : (el.position.y - el2.position.y) < el2.size.y)
            && (el.position.x < el2.position.x ? (el2.position.x - el.position.x) < el.size.x : (el.position.x - el2.position.x) < el2.size.x);
    }
}
//# sourceMappingURL=Scene.js.map