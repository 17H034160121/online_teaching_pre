import flvjs from 'flv.js'

export interface IPlayer {
  play: () => void;
  pause: () => void;
  reload: (src: string, type?: string) => void;
  setVolume: (value: number) => void;
  getPlayerInfo: () => PlayerInfo;
  dispose: () => void;
}

export interface PlayerInfo {
  volumn?: number;
  playing?: boolean;
}

export default class Player implements IPlayer {
  private INIT_VOLUME = 0.5; // 默认音量
  private INIT_PLAYING = true; // 默认是否播放

  private playerInfo: PlayerInfo;
  private vPlayer: flvjs.Player;
  private videoP: any;

  constructor(video: HTMLVideoElement, options?: PlayerInfo) {
    this.vPlayer = flvjs.createPlayer({
      type: 'flv',        // 指定视频类型
      isLive: true,       // 开启直播
      hasAudio: false,    // 关闭声音
      cors: true,         // 开启跨域访问
      url: "http://192.168.239.128:7431/live?port=1395&app=live&stream=1",
    });

    this.videoP = document.getElementById("videoElement");
    this.vPlayer.attachMediaElement(this.videoP);
    this.vPlayer.load();
    this.vPlayer.play();

    this.initPlayerInfo(options);
  }

  play(): void {
    this.vPlayer.play();
    this.playerInfo.playing = true;
  }

  pause(): void {
    this.vPlayer.pause();
    this.playerInfo.playing = false;
  }

  setVolume(value: number): void {
    this.vPlayer.volume = value;
  }

  reload(): void {
    this.vPlayer.unload();
    this.vPlayer.load();
    this.vPlayer.play();
  }

  dispose(): void {
    
    this.vPlayer.pause();
    this.vPlayer.unload();
    // 卸载DOM对象
    this.vPlayer.detachMediaElement();
    // 销毁flvjs对象
    this.vPlayer.destroy();
  }

  getPlayerInfo(): PlayerInfo {
    return this.playerInfo;
  }

  private initPlayerInfo(options?: PlayerInfo): void {
    const initOptions = {
      volume: this.INIT_VOLUME,
      playing: this.INIT_PLAYING
    };

    this.playerInfo = { ...initOptions, ...options };
    this.setVolume(this.playerInfo.volumn);


  }
}
