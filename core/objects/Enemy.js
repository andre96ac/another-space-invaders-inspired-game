import { Vector2 } from "../Utils/Vector2.js";
import { GameObject } from "./GameObject.js";
export class Enemy extends GameObject {
    maxHealth = 3;
    currentHealth = this.maxHealth;
    onCollisionEnter(other) {
    }
    update() {
    }
    load() {
    }
    unload() {
    }
    _enemyStep;
    get enemyStep() { return this._enemyStep; }
    ;
    constructor(gameController) {
        const enemySize = Vector2.create(40, 20);
        super(gameController, "rectangle", Vector2.zero, enemySize);
        this._enemyStep = this.size.x + 20;
        this.collidable = true;
    }
    moveDown(_this) {
        if (_this.position.y + _this.size.y + _this.enemyStep < _this.gameController.mainContext.canvas.height) {
            _this.position = Vector2.create(_this.position.x, _this.position.y + _this.enemyStep);
        }
        else {
            _this.position = Vector2.create(_this.position.x, _this.gameController.mainCanvas.height - _this.size.y);
        }
    }
    hit() {
        if (this.currentHealth > 0) {
            this.currentHealth--;
        }
        else {
            this.destroy();
        }
    }
}
//# sourceMappingURL=Enemy.js.map