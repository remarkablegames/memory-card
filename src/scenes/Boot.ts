import Phaser from 'phaser';

import { Audio, Scene } from '../constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Boot });
  }

  preload() {
    this.load.setPath('assets/');

    this.load.image('volume-icon', 'ui/volume-icon.png');
    this.load.image('volume-icon_off', 'ui/volume-icon_off.png');

    this.load.audio(Audio.CardFlip, 'audio/card-flip.mp3');
    this.load.audio(Audio.CardMatch, 'audio/card-match.mp3');
    this.load.audio(Audio.CardMismatch, 'audio/card-mismatch.mp3');
    this.load.audio(Audio.CardSlide, 'audio/card-slide.mp3');
    this.load.audio(Audio.ThemeSong, 'audio/fat-caps-audionatix.mp3');
    this.load.audio(Audio.Victory, 'audio/victory.mp3');
    this.load.audio(Audio.Whoosh, 'audio/whoosh.mp3');

    this.load.image('background');
    this.load.image('card-back', 'cards/card-back.png');
    this.load.image('card-0', 'cards/card-0.png');
    this.load.image('card-1', 'cards/card-1.png');
    this.load.image('card-2', 'cards/card-2.png');
    this.load.image('card-3', 'cards/card-3.png');
    this.load.image('card-4', 'cards/card-4.png');
    this.load.image('card-5', 'cards/card-5.png');

    this.load.image('heart', 'ui/heart.png');
  }

  create() {
    this.scene.start(Scene.Main);
  }
}
