import { Enemy } from "../objects/Enemy.js";
import { Player } from "../objects/Player.js";
import { Scene } from "./Scene.js";

export class GameScene extends Scene{

    //giocatore
    private player: Player | undefined;
    //nemici
    private enemies: Enemy[] = [];

    //stato tasti premuti
    private pressD: boolean = false;
    private pressA: boolean = false;

    //nemici massimi per riga
    private maxEnemyRowCount = 30;
    //nemici massimi per riga in questo momento
    private currentEnemyRowCount = 0;
    //posizioni di pawn dei nemici
    private arPositions: number[] = [];

    //istanza nemico generata random quando necessario
    private enemySample: Enemy | undefined;

    //intervallo di tick 
    private tickInterval: number | undefined;
    //puntatore al timer
    private intervalPtr: number | undefined;
    //contatore di tick
    private tickCounter: number = 0;
    //livello attuale
    private currentLevel: number = 1;


    //#region RATIO AUMENTO DIFFICOLTA'

    //Numero di tick per aumento livello
    private tickPerLevel: number = 20

    //Nemici massimi iniziali per riga 
    private starMaxEnemiesPerRow = 5;

    //Aumento di nemici massimi per riga per livello
    private increaseEnemyRatio = 1;

    //Velocità di tick iniziale
    private startTickInterval = 4000;

    //Diminuzione velocità di tick per livello
    private tickDecreaseRatio = 200;

    //#endregion


    public update(): void {
        if(this.pressA){
            this.player?.moveLeft()
        }
        else if(this.pressD){
            this.player?.moveRight();
        }
    }
    public load(): void {

        this.currentEnemyRowCount = this.starMaxEnemiesPerRow;

        //creo l'array con le posizioni dei nemici
        this.initArPositions();

        //registro i listeners sulla tastiera
        this.registerKeyEvents();

        //creo il giocatore
        this.player = this.istantiateEl(Player);
     
        // faccio partire il timer dei nemici
        this.setTick(this.startTickInterval);
    }
    public unload(): void {
        
    }
    
    /**
     * Registrazione Listeners sulla tastiera
     */
    private registerKeyEvents(): void{
        document.addEventListener("keypress", e => {
            if(e.key == 'a'){
                this.pressA = true;
            }
            else if(e.key == 'd'){
                this.pressD = true;
            }
            
        })
        document.addEventListener("keyup", e => {
            if(e.key == 'a'){
                this.pressA = false;
            }
            else if(e.key == 'd'){
                this.pressD = false;
            }
    
        })
        
    }

    /**
     * Creazione array con le posizioni di spawn dei nemici
     */
    private initArPositions(): void{

        this.enemySample = new Enemy(this.gameController);
        const enemySizeX = this.enemySample.size.x;
        delete this.enemySample

        const step = this.gameController.mainCanvas.width / this.maxEnemyRowCount;
        const start = step/2 - enemySizeX/2;
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
            enemyInstance.moveAt({x: positionX[0], y: enemyInstance.size.y});
            this.enemies.push(enemyInstance)

        }
    }

    /**
     * Scatta ad ogni tick per far avanzare e spawnare i nemici
     * @param _this 
     */
    private tick(_this: typeof this){
        _this.enemies.forEach(enemy => enemy.moveDown(enemy));
        _this.spawnEnemyRow();
        this.tickCounter ++;
        if(this.tickCounter / this.tickPerLevel > this.currentLevel){
            this.increaseLevel();
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
            setInterval(() => this.tick(this), this.tickInterval);
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

}