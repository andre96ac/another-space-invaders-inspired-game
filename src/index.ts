import { SpaceInvaders } from "./SpaceInvaders.js";

const mainContainer: HTMLDivElement|null  = <HTMLDivElement>document.getElementById("mainContainer");
if(!!mainContainer){
    const game = new SpaceInvaders(mainContainer);
    game.start();
}
