import { GameObject } from "./GameObject.js";
export class Enemy extends GameObject {
    _enemyStep;
    get enemyStep() { return this._enemyStep; }
    ;
    constructor(gameController) {
        const enemySize = { x: 10, y: 20 };
        super(gameController, "rectangle", { x: 0, y: 0 }, enemySize);
        this._enemyStep = this.size.x + 20;
    }
    moveDown(_this) {
        if (_this._position.y + _this.size.y + _this.enemyStep < _this.gameController.mainContext.canvas.height) {
            _this._position.y += _this.enemyStep;
        }
        else {
            _this.position.y = _this.gameController.mainCanvas.height - _this.size.y;
        }
    }
    moveAt(position) {
        this._position = position;
    }
}
//# sourceMappingURL=Enemy.js.map