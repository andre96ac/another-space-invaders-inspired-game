import { SpaceInvaders } from "./SpaceInvaders.js";
import { Game } from "./core/Game.js";

const mainCanvas: HTMLCanvasElement|null  = <HTMLCanvasElement>document.getElementById("mainCanvas");
if(!!mainCanvas){
    const game = new SpaceInvaders(mainCanvas);
    game.start();
}
