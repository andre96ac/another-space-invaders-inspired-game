import { GameScene } from "./scenes/GameScene.js";
export class Game {
    _mainCanvas;
    _mainContext;
    _currentScene;
    get mainContext() { return this._mainContext; }
    ;
    get mainCanvas() { return this._mainCanvas; }
    ;
    get currentScene() { return this._currentScene; }
    ;
    lastTimestamp = 0;
    currentTimestamp = 0;
    get deltaTime() {
        return (this.currentTimestamp - this.lastTimestamp) / 6;
    }
    constructor(canvas, context) {
        this._mainCanvas = canvas;
        this._mainContext = context;
    }
    start() {
        this.mainContext.canvas.height = window.innerHeight - 20;
        this.mainContext.canvas.width = window.innerWidth - 15;
        this.loadScene(GameScene);
        window.requestAnimationFrame((timestamp) => this.frame(this, timestamp));
    }
    frame(pthis, timestamp) {
        this.currentTimestamp = timestamp;
        if (this.lastTimestamp == undefined) {
            this.lastTimestamp = timestamp;
        }
        this._currentScene?.update();
        this._currentScene?.render();
        this._currentScene?.checkCollisions();
        this.lastTimestamp = this.currentTimestamp;
        window.requestAnimationFrame((timestamp) => this.frame(pthis, timestamp));
    }
    loadScene(sceneFactory) {
        this._currentScene?.unload();
        this._currentScene = new sceneFactory(this);
        this._currentScene.load();
    }
}
//# sourceMappingURL=Game.js.map