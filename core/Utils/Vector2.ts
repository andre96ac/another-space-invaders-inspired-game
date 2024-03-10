export class Vector2{
    private readonly _x: number;
    private readonly _y: number;
    private constructor(x: number, y: number){
        this._x = x;
        this._y = y;
    }

    public get x(){return this._x}
    public get y(){return this._y}

    static create(x: number, y: number): Vector2{
        return new Vector2(x, y);
    }
    static copy(origin: Vector2): Vector2{
        return new Vector2(origin._x, origin._y);
    }
    static get zero(): Vector2{
        return new Vector2(0, 0);
    }
}