import { Audio, Image } from '../constants';

/**
 * Create a card game object
 */
export function createCard({
  scene,
  x,
  y,
  frontTexture,
  cardName,
}: {
  scene: Phaser.Scene;
  x: number;
  y: number;
  frontTexture: string;
  cardName: string;
}) {
  let isFlipping = false;
  let isFront = false;

  const card = scene.add
    .image(x, y, Image.CardBack)
    .setName(cardName)
    .setInteractive();

  function flipCard(callbackComplete?: () => void) {
    if (isFlipping) {
      return;
    }

    isFlipping = true;
    scene.sound.play(Audio.CardFlip);

    scene.tweens.chain({
      targets: card,
      ease: Phaser.Math.Easing.Expo.InOut,
      tweens: [
        {
          duration: 200,
          scaleY: 1.1,
        },
        {
          duration: 300,
          scaleY: 1,
        },
      ],
    });

    scene.add.tween({
      targets: card,
      scaleX: 0,
      ease: Phaser.Math.Easing.Expo.Out,
      duration: 250,
      onComplete() {
        isFront = !isFront;
        card.setTexture(isFront ? frontTexture : Image.CardBack);

        scene.add.tween({
          targets: card,
          scaleX: 1,
          ease: Phaser.Math.Easing.Expo.Out,
          duration: 250,
          onComplete() {
            isFlipping = false;

            if (typeof callbackComplete === 'function') {
              callbackComplete();
            }
          },
        });
      },
    });
  }

  function destroy() {
    scene.add.tween({
      targets: [card],
      y: card.y - 1000,
      ease: Phaser.Math.Easing.Expo.In,
      duration: 500,
      onComplete() {
        card.destroy();
      },
    });
  }

  return {
    gameObject: card,
    flip: flipCard,
    destroy,
    cardName,
    hasFaceAt: (px: number, py: number) =>
      Phaser.Geom.Rectangle.Contains(card.getBounds(), px, py),
  };
}
