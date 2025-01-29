import Phaser from 'phaser';
import { render } from 'phaser-jsx';
import type { RefObject } from 'react';

import { Lose, Title, Win } from '../components';
import { Audio, Image, Scene } from '../constants';
import { createCard } from '../utils/createCard';

/**
 * Card Memory Game by Francisco Pereira (Gammafp)
 * -----------------------------------------------
 *
 * Test your memory skills in this classic game of matching pairs.
 * Flip over cards to reveal pictures, and try to remember where each image is located.
 * Match all the pairs to win!
 *
 * Music credits:
 * "Fat Caps" by Audionautix is licensed under the Creative Commons Attribution 4.0 license. https://creativecommons.org/licenses/by/4.0/
 * Artist http://audionautix.com/
 */
export class Main extends Phaser.Scene {
  // All cards names
  cardNames = [
    Image.Card1,
    Image.Card2,
    Image.Card3,
    Image.Card4,
    Image.Card5,
    Image.Card6,
  ];

  // Cards Game Objects
  cards: ReturnType<typeof this.createGridCards> = [];

  // History of card opened
  cardOpened?: ReturnType<typeof createCard>;

  // Can play the game
  canMove = false;

  // Game variables
  lives = 0;

  // Grid configuration
  gridConfiguration = {
    x: 113,
    y: 102,
    paddingX: 10,
    paddingY: 10,
  };

  constructor() {
    super({ key: Scene.Main });
  }

  init() {
    // Fadein camera
    this.cameras.main.fadeIn(500);
    this.lives = 10;
    this.volumeButton();
  }

  create() {
    // Background image
    this.add
      .image(
        this.gridConfiguration.x - 63,
        this.gridConfiguration.y - 77,
        Image.Background,
      )
      .setOrigin(0);

    render(<Title onClick={this.startGame.bind(this)} />, this);
  }

  restartGame() {
    this.cardOpened = undefined;
    this.cameras.main.fadeOut(200 * this.cards.length);
    this.cards.reverse().map((card, index) => {
      this.add.tween({
        targets: card.gameObject,
        duration: 500,
        y: 1000,
        delay: index * 100,
        onComplete: () => {
          card.gameObject.destroy();
        },
      });
    });

    this.time.addEvent({
      delay: 200 * this.cards.length,
      callback: () => {
        this.cards = [];
        this.canMove = false;
        this.scene.restart();
        this.sound.play(Audio.CardSlide, { volume: 1.2 });
      },
    });
  }

  createGridCards() {
    // Phaser random array position
    const gridCardNames = Phaser.Utils.Array.Shuffle([
      ...this.cardNames,
      ...this.cardNames,
    ]);

    return gridCardNames.map((name, index) => {
      const newCard = createCard({
        scene: this,
        x:
          this.gridConfiguration.x +
          (98 + this.gridConfiguration.paddingX) * (index % 4),
        y: -1000,
        frontTexture: name,
        cardName: name,
      });

      this.add.tween({
        targets: newCard.gameObject,
        duration: 800,
        delay: index * 100,
        onStart: () => this.sound.play(Audio.CardSlide, { volume: 1.2 }),
        y:
          this.gridConfiguration.y +
          (128 + this.gridConfiguration.paddingY) * Math.floor(index / 4),
      });

      return newCard;
    });
  }

  createHearts() {
    return Array.from(new Array(this.lives)).map((el, index) => {
      const heart = this.add
        .image(this.sys.game.scale.width + 1000, 20, Image.Heart)
        .setScale(2);

      this.add.tween({
        targets: heart,
        ease: Phaser.Math.Easing.Expo.InOut,
        duration: 1000,
        delay: 1000 + index * 200,
        x: 140 + 30 * index, // marginLeft + spaceBetween * index
      });
      return heart;
    });
  }

  volumeButton() {
    const volumeIcon = this.add
      .image(25, 25, Image.VolumeIcon)
      .setName(Image.VolumeIcon);
    volumeIcon.setInteractive();

    // Mouse enter
    volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
    });

    // Mouse leave
    volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor('default');
    });

    volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.sound.volume === 0) {
        this.sound.setVolume(1);
        volumeIcon.setTexture(Image.VolumeIcon);
        volumeIcon.setAlpha(1);
      } else {
        this.sound.setVolume(0);
        volumeIcon.setTexture(Image.VolumeIconOff);
        volumeIcon.setAlpha(0.5);
      }
    });
  }

  startGame() {
    let winnerTextRef: RefObject<Phaser.GameObjects.Text | null>;

    render(
      <Win
        onClick={this.restartGame.bind(this)}
        ref={(ref) => (winnerTextRef = ref)}
      />,
      this,
    );

    let gameOverTextRef: RefObject<Phaser.GameObjects.Text | null>;

    render(
      <Lose
        onClick={this.restartGame.bind(this)}
        ref={(ref) => (gameOverTextRef = ref)}
      />,
      this,
    );

    // Start lifes images
    const hearts = this.createHearts();

    // Create a grid of cards
    this.cards = this.createGridCards();

    // Start canMove
    this.time.addEvent({
      delay: 200 * this.cards.length,
      callback: () => {
        this.canMove = true;
      },
    });

    // Game Logic
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      (pointer: Phaser.Input.Pointer) => {
        if (this.canMove) {
          const card = this.cards.find((card) => {
            card.gameObject.hasFaceAt(pointer.x, pointer.y);
          });

          if (card) {
            this.input.setDefaultCursor('pointer');
          } else {
            this.input.setDefaultCursor('default');
          }
        }
      },
    );

    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        if (this.canMove && this.cards.length) {
          const card = this.cards.find((card) =>
            card.gameObject.hasFaceAt(pointer.x, pointer.y),
          );

          if (card) {
            this.canMove = false;

            // Detect if there is a card opened
            if (this.cardOpened !== undefined) {
              // If the card is the same that the opened not do anything
              if (
                this.cardOpened.gameObject.x === card.gameObject.x &&
                this.cardOpened.gameObject.y === card.gameObject.y
              ) {
                this.canMove = true;
                return false;
              }

              card.flip(() => {
                if (this.cardOpened?.cardName === card.cardName) {
                  // ------- Match -------
                  this.sound.play(Audio.CardMatch);
                  // Destroy card selected and card opened from history
                  this.cardOpened.destroy();
                  card.destroy();

                  // remove card destroyed from array
                  this.cards = this.cards.filter(
                    (cardLocal) => cardLocal.cardName !== card.cardName,
                  );
                  // reset history card opened
                  this.cardOpened = undefined;
                  this.canMove = true;
                } else {
                  // ------- No match -------
                  this.sound.play(Audio.CardMismatch);
                  this.cameras.main.shake(600, 0.01);
                  // remove life and heart
                  const lastHeart = hearts[hearts.length - 1];
                  this.add.tween({
                    targets: lastHeart,
                    ease: Phaser.Math.Easing.Expo.InOut,
                    duration: 1000,
                    y: -1000,
                    onComplete: () => {
                      lastHeart.destroy();
                      hearts.pop();
                    },
                  });
                  this.lives -= 1;
                  // Flip last card selected and flip the card opened from history and reset history
                  card.flip();
                  this.cardOpened?.flip(() => {
                    this.cardOpened = undefined;
                    this.canMove = true;
                  });
                }

                // Check if the game is over
                if (this.lives === 0) {
                  // Show Game Over text
                  this.sound.play(Audio.Whoosh, { volume: 1.3 });
                  this.add.tween({
                    targets: gameOverTextRef.current,
                    ease: Phaser.Math.Easing.Bounce.Out,
                    y: this.sys.game.scale.height / 2,
                  });

                  this.canMove = false;
                }

                // Check if the game is won
                if (this.cards.length === 0) {
                  this.sound.play(Audio.Whoosh, { volume: 1.3 });
                  this.sound.play(Audio.Victory);

                  this.add.tween({
                    targets: winnerTextRef.current,
                    ease: Phaser.Math.Easing.Bounce.Out,
                    y: this.sys.game.scale.height / 2,
                  });
                  this.canMove = false;
                }
              });
            } else if (
              this.cardOpened === undefined &&
              this.lives > 0 &&
              this.cards.length > 0
            ) {
              // If there is not a card opened save the card selected
              card.flip(() => {
                this.canMove = true;
              });
              this.cardOpened = card;
            }
          }
        }
      },
    );
  }
}
