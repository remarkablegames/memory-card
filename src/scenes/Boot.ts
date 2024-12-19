import Phaser from 'phaser';

import { Audio, Image, Scene } from '../constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: Scene.Boot });
  }

  preload() {
    this.load.setPath('assets/');

    this.load.audio(Audio.CardFlip, 'audio/card-flip.mp3');
    this.load.audio(Audio.CardMatch, 'audio/card-match.mp3');
    this.load.audio(Audio.CardMismatch, 'audio/card-mismatch.mp3');
    this.load.audio(Audio.CardSlide, 'audio/card-slide.mp3');
    this.load.audio(Audio.ThemeSong, 'audio/fat-caps-audionatix.mp3');
    this.load.audio(Audio.Victory, 'audio/victory.mp3');
    this.load.audio(Audio.Whoosh, 'audio/whoosh.mp3');

    this.load.image(Image.Background, 'background.png');
    this.load.image(Image.Card1, 'cards/card-0.png');
    this.load.image(Image.Card2, 'cards/card-1.png');
    this.load.image(Image.Card3, 'cards/card-2.png');
    this.load.image(Image.Card4, 'cards/card-3.png');
    this.load.image(Image.Card5, 'cards/card-4.png');
    this.load.image(Image.Card6, 'cards/card-5.png');
    this.load.image(Image.CardBack, 'cards/card-back.png');
    this.load.image(Image.Heart, 'ui/heart.png');
    this.load.image(Image.VolumeIcon, 'ui/volume-icon.png');
    this.load.image(Image.VolumeIconOff, 'ui/volume-icon_off.png');
  }

  create() {
    this.scene.start(Scene.Main);
  }
}
