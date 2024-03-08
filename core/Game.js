import { GameScene } from "./scenes/GameScene.js";
export class Game {
    _mainCanvas;
    _mainContext;
    _currentScene;
    get mainContext() { return this._mainContext; }
    ;
    get mainCanvas() { return this._mainCanvas; }
    ;
    constructor(canvas, context) {
        this._mainCanvas = canvas;
        this._mainContext = context;
    }
    start() {
        this.mainContext.canvas.height = window.innerHeight - 20;
        this.mainContext.canvas.width = window.innerWidth - 15;
        this.loadScene(new GameScene(this));
        // setInterval(() =>{
        //     this._currentScene?.update();
        //     this._currentScene?.render();
        // }, 0)
        window.requestAnimationFrame(() => this.frame(this));
    }
    frame(pthis) {
        this._currentScene?.update();
        this._currentScene?.render();
        window.requestAnimationFrame(() => this.frame(pthis));
    }
    loadScene(scene) {
        this._currentScene?.unload();
        this._currentScene = scene;
        this._currentScene.load();
    }
}
//# sourceMappingURL=Game.js.map