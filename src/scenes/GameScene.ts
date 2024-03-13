import { Game } from "../core/Game.js";
import { Vector2 } from "../core/Helpers/Vector2.js";
import { Bullet } from "../objects/Bullet.js";
import { Enemy } from "../objects/Enemy.js";
import { GameObject } from "../core/GameObject.js";
import { Player } from "../objects/Player.js";
import { Wall } from "../objects/Wall.js";
import { Scene } from "../core/Scene.js";
import { DeathScene } from "./DeathScene.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { Primitive } from "../core/Primitive.js";

export class GameScene extends Scene<SpaceInvaders>{
 
    //#region RATIO AUMENTO DIFFICOLTA'
    
    
    //tempo per ogni livello
    private secondsPerLevel: number = 30;

    //Nemici massimi iniziali per riga 
    private starMaxEnemiesPerRow = 1;

    //Aumento di nemici massimi per riga per livello
    private increaseEnemyRatio = 0.5;

    //Velocità di tick iniziale
    private startTickInterval = 5000;
    
    //Diminuzione velocità di tick per livello
    private tickDecreaseRatio = 400;
    
    //#endregion


    //giocatori
    private player1: Player | undefined;
    private player2: Player | undefined;
    //nemici
    private enemies: Enemy[] = [];

    //stato tasti premuti
    private pressD: boolean = false;
    private pressA: boolean = false;
    private pressLeft: boolean = false;
    private pressRight: boolean = false;


    //nemici massimi per riga
    private maxEnemyRowCount = 20;
    //nemici massimi per riga in questo momento
    private currentEnemyRowCount = this.starMaxEnemiesPerRow;
    //posizioni di pawn dei nemici
    private arPositions: number[] = [];

    //istanza nemico generata random quando necessario
    private enemySample: Enemy | undefined;

    //intervallo di tick 
    private tickInterval: number | undefined;
    //puntatore al timer
    private intervalPtr: number | undefined;
    //livello attuale
    private currentLevel: number = 1;




    public onUpdate() {
        if(this.pressA){
            this.player1?.moveLeft()
        }
        else if(this.pressD){
            this.player1?.moveRight();
        }

        if(this.pressLeft){
            this.player2?.moveLeft();
        }
        else if(this.pressRight){
            this.player2?.moveRight();
        }

        return super.onUpdate();
    }
    public onLoad() {

        this.gameController.killCount = 0;

        //creo l'array con le posizioni dei nemici
        this.initArPositions();

        //creo il giocatore
        this.initPlayers();
        
        //registro i listeners sulla tastiera
        this.registerKeyEvents();
        
        //creo i muri
        this.initWalls()

        // faccio partire il timer dei nemici
        this.setTick(this.startTickInterval);


        //faccio partire il timer per l'aumento livello
        this.setInterval(() => this.increaseLevel(), this.secondsPerLevel*1000)

        //disegno lo sfondo
        this.gameController.drawBackground("background.png");

        this.gameController.playAudioLoop("music.mp3");
 
    }

   
    private initWalls(){
       
        const box = this.istantiateEl(Primitive)
        box.color = "white"
        box.lineWidth = 2;
        box.fill = false;
        box.size = Vector2.create(this.gameController.mainCanvas.width - 10, this.gameController.mainCanvas.height - 10)
        box.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2))
    }
    


    public onUnload(){
        return super.onUnload();
    }


    public onPause(): void {
        this.gameController.stopAudioLoop();
    }
    public onResume(): void {
        this.gameController.playAudioLoop();
    }

    
    /**
     * Registrazione Listeners sulla tastiera
     */
    private registerKeyEvents(): void{

        this.registerKeyDownListener('a', () => this.pressA = true)
        this.registerKeyDownListener('d', () => this.pressD = true)
        
        this.registerKeyUpListener('a', () => this.pressA = false)
        this.registerKeyUpListener('d', () => this.pressD = false)


        if(!!this.player2){
            this.registerKeyDownListener('ArrowRight', () => this.pressRight = true)
            this.registerKeyDownListener('ArrowLeft', () => this.pressLeft = true)
    
            this.registerKeyUpListener('ArrowRight', () => this.pressRight = false)
            this.registerKeyUpListener('ArrowLeft', () => this.pressLeft = false)
        }
        
        
        
        this.registerKeyDownListener('p', () => this.gameController.paused? this.gameController.resume() : this.gameController.pause())
    }

    /**
     * Creazione array con le posizioni di spawn dei nemici
     */
    private initArPositions(): void{

        this.enemySample = new Enemy(this.gameController);
        delete this.enemySample

        const step = this.gameController.mainCanvas.width / this.maxEnemyRowCount;
        const start = step/2;
        for (let index = 0; index < this.maxEnemyRowCount; index++) {
            this.arPositions.push(step * index + start);
            
        }
    }


    /**
     * Spawna una riga di nemici
     */
    private spawnEnemyRow(){
        const enemyCount = Math.random() * this.currentEnemyRowCount
        const arPositionsCopy = [...this.arPositions];
        for (let counter = 0; counter < enemyCount; counter++) {
            const idx = Math.random() * arPositionsCopy.length;

            const positionX = arPositionsCopy.splice(idx, 1);
            const enemyInstance = this.istantiateEl(Enemy);
            enemyInstance.moveAtCentre(Vector2.create(positionX[0], enemyInstance.size.y /2 + 10));
            this.enemies.push(enemyInstance)

        }
    }

    /**
     * Scatta ad ogni tick per far avanzare e spawnare i nemici
     */
    private tick(){
        if(!this.gameController.paused){
            this.enemies.forEach(enemy => enemy.moveDown(enemy));
            this.spawnEnemyRow();
        }
    }

    /**
     * Cambia l'intervallo di tick
     * @param tickInterval 
     */
    private setTick(tickInterval: number){
        if(tickInterval > 0){
            if(!!this.intervalPtr){
                clearInterval(this.intervalPtr);
            }
    
            this.tickInterval = tickInterval;
            this.intervalPtr = this.setInterval(() => this.tick(), this.tickInterval);
        }

    }

    /**
     * Aumenta il livello (aumenta la difficaoltà)
     */
    private increaseLevel(){
        this.currentLevel ++;
        if(!!this.tickInterval){
            this.setTick(this.tickInterval - this.tickDecreaseRatio);
        }

        if(this.currentEnemyRowCount + this.increaseEnemyRatio <= this.maxEnemyRowCount){
            this.currentEnemyRowCount += this.increaseEnemyRatio;
        }
        else{
            this.currentEnemyRowCount = this.maxEnemyRowCount;
        }
    }
    public destroyEl(gameObj: GameObject) {
        if(gameObj instanceof Enemy){
            this.enemies.splice(this.enemies.findIndex(el => gameObj == el), 1)
        }
        return super.destroyEl(gameObj);
    }

    public incrementKillCount(){
        this.gameController.killCount ++;
    }

    public playerDie(){
        this.gameController.loadScene(DeathScene)
    }

    private initPlayers(){
        this.player1 = this.istantiateEl(Player);
        this.player1.moveAtCentre(Vector2.create(this.gameController.mainCanvas.clientWidth/2, this.gameController.mainCanvas.clientHeight - this.player1.size.y/2 - 10))
        
        if(this.gameController.playerNumber > 1){
            this.player2 = this.istantiateEl(Player);
            this.player1.moveAtCentre(Vector2.create(this.gameController.mainCanvas.clientWidth/3, this.gameController.mainCanvas.clientHeight - this.player1.size.y/2 - 10))
            this.player2.moveAtCentre(Vector2.create(this.gameController.mainCanvas.clientWidth/3*2, this.gameController.mainCanvas.clientHeight - this.player2.size.y/2 - 10))
        }
    }

}