export class Scene {
    gameObjList = [];
    gameController;
    constructor(gameController) {
        this.gameController = gameController;
    }
    istantiateEl(Factory) {
        const instance = new Factory(this.gameController);
        this.gameObjList.push(instance);
        return instance;
    }
    destroyEl(gameObj) {
        const idx = this.gameObjList.findIndex(el => el == gameObj);
        this.gameObjList.splice(idx, 1);
    }
    render() {
        this.gameController.mainContext.clearRect(0, 0, this.gameController.mainCanvas.width, this.gameController.mainCanvas.height);
        this.gameObjList.forEach(el => el.render(this.gameController.mainContext));
    }
}
//# sourceMappingURL=Scene.js.map