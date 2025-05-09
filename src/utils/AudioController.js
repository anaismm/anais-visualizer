import gsap from "gsap";
import detect from "bpm-detective";

class AudioController {
  constructor() {
    this.isPlaying = false; // état de lecture
    this.currentSrc = null; // source du morceau en cours de lecture
    this.isLooping = false;
   
  }

  setup() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.bpm = null;

    // this.audio.src = danceTheNight;
    this.audio.volume = 0.1;

    this.audioSource = this.ctx.createMediaElementSource(this.audio);

    this.analyserNode = new AnalyserNode(this.ctx, {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
    });

    this.fdata = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.audioSource.connect(this.analyserNode);
    this.audioSource.connect(this.ctx.destination);

    gsap.ticker.add(this.tick);

    this.audio.addEventListener("loadeddata", async () => {
      await this.detectBPM();
      // console.log(`The BPM is: ${bpm}`);
    });


    this.audio.addEventListener("ended", () => {
      if (this.isLooping) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else if (typeof this.onTrackEnd === "function") {
        this.onTrackEnd(); // Appelle la fonction définie depuis React
      }
    });
  }

  detectBPM = async () => {
    // Create an offline audio context to process the data
    const offlineCtx = new OfflineAudioContext(
      1,
      this.audio.duration * this.ctx.sampleRate,
      this.ctx.sampleRate
    );
    // Decode the current audio data
    const response = await fetch(this.audio.src); // Fetch the audio file
    const buffer = await response.arrayBuffer();
    const audioBuffer = await offlineCtx.decodeAudioData(buffer);
    // Use bpm-detective to detect the BPM
    this.bpm = detect(audioBuffer);
    console.log(`Detected BPM: ${this.bpm}`);
    // return bpm;
  };

  

  togglePlayPause(src) {
    if (this.currentSrc === src) {
      // Même morceau qu'avant
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    } else {
      // Nouveau morceau
      this.audio.src = src;
      this.currentSrc = src;
      this.audio.play();
    }
  }

  play(src) {
    if (this.currentSrc !== src) {
      this.audio.src = src;
      this.currentSrc = src;
    }
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }  

  toggleLoop() {
    this.audio.loop = !this.audio.loop;
    this.isLooping = this.audio.loop;
  }

  getIsPlaying() {
    return !this.audio.paused;
  }
  
  getCurrentSrc = () => this.currentSrc;
  

  setOnTrackEnd(callback) {
    this.onTrackEnd = callback;
  }
  

  tick = () => {
    this.analyserNode.getByteFrequencyData(this.fdata);
  };
}

const audioController = new AudioController();
export default audioController;
