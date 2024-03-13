export class AudioController{

    private arSources: string[] = [];
    private arBuffers: ArrayBuffer[] = [];
    private arAudioData: AudioBuffer[] = [];

    private context = new window.AudioContext();

    private currentLoopSource: AudioBufferSourceNode | undefined;
    private currentLoopPlaying: boolean = false;

    constructor(){
    }

    public loadClips(arAudioNames: string[]): Promise<void>{
        this.arSources = arAudioNames;

        return Promise.all(this.arSources.map(name => fetch(`./assets/${name}`).then(res => res.arrayBuffer())))
                    .then(buffers => {
                        this.arBuffers = buffers; 
                        return Promise.all(this.arBuffers.map( (buf) => this.context.decodeAudioData( buf )))
                    })
                    .then(audioData => {
                        this.arAudioData = audioData;
                    })
                    .catch(err => {
                        console.error("Error loading audio traces");
                        return Promise.reject(err);
                    })
    }


    public playAudioLoop(assetName?: string){

        if(!!assetName){
            //devo creare una nuova source
            if(this.currentLoopPlaying){
                this.currentLoopSource?.stop();
            }
            this.currentLoopSource = this.context.createBufferSource();
            this.currentLoopSource.buffer = this.findAudio(assetName);
            this.currentLoopSource.loop = true;
            this.currentLoopSource.connect( this.context.destination );
            this.currentLoopSource.start(this.context.currentTime + 0.1);
            this.currentLoopPlaying = true;
            
        }
        else{
            if(!this.currentLoopPlaying){
                if(!!this.currentLoopSource){
                    const oldSource = this.currentLoopSource;
                    this.currentLoopSource = this.context.createBufferSource();
                    this.currentLoopSource.buffer = oldSource.buffer;
                    this.currentLoopSource.loop = true;
                    this.currentLoopSource.connect( this.context.destination );
                    this.currentLoopSource.start(this.context.currentTime + 0.1);
                    this.currentLoopPlaying = true;

                }
                else{
                    console.warn("No audio to restart")
                }
            }
            else{
                console.warn("audio already playing")
            }

        }


    }

    public stopAudioLoop(){
        if(!!this.currentLoopSource){

            if(this.currentLoopPlaying){
                this.currentLoopSource?.stop();
                this.currentLoopPlaying = false;
            }
            else{
                console.warn("Audio already stopped")
            }
        }
        else{
            console.warn("No audio to stop")
        }
    }


    public playAudioOneShot(assetName: string){


        const source = this.context.createBufferSource();
        source.buffer = this.findAudio(assetName);
        source.connect( this.context.destination );
        source.start( this.context.currentTime + 0.1 );
              
    }

    private findAudio(assetName:string): AudioBuffer {
        const idx = this.arSources.findIndex(el => el == assetName)
        if(idx < 0){
            throw Error(`Audio ${assetName} not loaded in memory`);
        }
        return this.arAudioData[idx];
    }
} 

