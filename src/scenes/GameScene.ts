import { Vector2 } from "../core/Helpers/Vector2.js";
import { Enemy } from "../objects/Enemy.js";
import { GameObject } from "../core/GameObject.js";
import { Player } from "../objects/Player.js";
import { Scene } from "../core/Scene.js";
import { DeathScene } from "./DeathScene.js";
import { SpaceInvaders } from "../SpaceInvaders.js";
import { Primitive } from "../core/Prefabs/Primitive.js";
import { ScheduledInterval, ScheduledTask } from "../core/Helpers/ScheduledTask.js";

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

    //Percentuale di spawn powerup
    private _powerUpSpawnPercentage = 0;
    public get powerUpSpawnPercentage() { return this._powerUpSpawnPercentage }
    
    //aumento percentuale di spawn power up per livello
    private powerUpspawnStep = .02;

    
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
    private intervalPtr: ScheduledInterval | undefined;
    //livello attuale
    private currentLevel: number = 1;




    public onUpdate(timestamp: DOMHighResTimeStamp) {
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

        return super.onUpdate(timestamp);
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
 
        this.drawUi();
    }

   
    private initWalls(){
       
        const box = this.istantiateEl(Primitive)
        box.zIndex = 100;
        box.color = "white"
        box.lineWidth = 2;
        box.fill = false;
        box.size = Vector2.create(this.gameController.mainCanvas.width - 10, this.gameController.mainCanvas.height - 10)
        box.moveAtCentre(Vector2.create(this.gameController.mainCanvas.width/2, this.gameController.mainCanvas.height/2))
    }
    


    public onUnload(){
        this.cleanUi();
        return super.onUnload();
    }


    public onPause(now: DOMHighResTimeStamp) {
        this.gameController.stopAudioLoop();
        return super.onPause(now);
    }
    public onResume(now: DOMHighResTimeStamp) {
        this.gameController.playAudioLoop();
        return super.onResume(now);
    }

    
    /**
     * Registrazione Listeners sulla tastiera
     */
    private registerKeyEvents(): void{

        this.registerKeyDownListener('a', () => this.pressA = true)
        this.registerKeyDownListener('d', () => this.pressD = true)
        this.registerKeyDownListener('w', () => this.player1?.jump())
        
        this.registerKeyUpListener('a', () => this.pressA = false)
        this.registerKeyUpListener('d', () => this.pressD = false)
        
        
        if(!!this.player2){
            this.registerKeyDownListener('ArrowRight', () => this.pressRight = true)
            this.registerKeyDownListener('ArrowLeft', () => this.pressLeft = true)
            this.registerKeyDownListener('ArrowUp', () => this.player2?.jump())
            
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
                this.clearInterval(this.intervalPtr);
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

        this._powerUpSpawnPercentage += this.powerUpspawnStep;
        this.drawUi();
    }
    public destroyEl(gameObj: GameObject<SpaceInvaders>) {
        if(gameObj instanceof Enemy){
            const idx = this.enemies.findIndex(el => gameObj == el);
            if(idx >= 0 ){
                this.enemies.splice(idx, 1)
            }
        }
        return super.destroyEl(gameObj);
    }

    public incrementKillCount(){
        this.gameController.killCount ++;
        this.drawUi();
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


    private drawUi():void {
        this.cleanUi();
        this.gameController.uiContext.textAlign = "left";

        this.gameController.uiContext.textBaseline = "middle";
        this.gameController.uiContext.fillStyle = "white";

        this.gameController.uiContext.font = "20px Tahoma"
        this.gameController.uiContext.fillText("Kills: ", 30,30);
        
        this.gameController.uiContext.font = "20px Tahoma"
        this.gameController.uiContext.fillText(this.gameController.killCount + '', 100,30);

        this.gameController.uiContext.font = "20px Tahoma"
        this.gameController.uiContext.fillText("Level: ", 30,60);
        this.gameController.uiContext.font = "20px Tahoma"
        this.gameController.uiContext.fillText(this.currentLevel+'', 100,60);
    }

    private cleanUi(){
        this.gameController.clearContext("ui");
    }



}