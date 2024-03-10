export class Vector2 {
    _x;
    _y;
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    static create(x, y) {
        return new Vector2(x, y);
    }
    static copy(origin) {
        return new Vector2(origin._x, origin._y);
    }
    static get zero() {
        return new Vector2(0, 0);
    }
}
//# sourceMappingURL=Vector2.js.map