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
  const rotation = { y: 0 };

  const card = scene.add
    .plane(x, y, Image.CardBack)
    .setName(cardName)
    .setInteractive();

  // start with the card face down
  card.modelRotation.y = 0;

  function flipCard(callbackComplete?: () => void) {
    if (isFlipping) {
      return;
    }

    scene.add.tween({
      targets: [rotation],
      y: rotation.y === 180 ? 0 : 180,
      ease: Phaser.Math.Easing.Expo.Out,
      duration: 500,

      onStart() {
        isFlipping = true;
        scene.sound.play(Audio.CardFlip);
        scene.tweens.chain({
          targets: card,
          ease: Phaser.Math.Easing.Expo.InOut,
          tweens: [
            {
              duration: 200,
              scale: 1.1,
            },
            {
              duration: 300,
              scale: 1,
            },
          ],
        });
      },

      onUpdate() {
        // card.modelRotation.y = Phaser.Math.DegToRad(180) + Phaser.Math.DegToRad(rotation.y);
        (card as unknown as { rotateY: number }).rotateY = 180 + rotation.y;
        const cardRotation =
          Math.floor((card as unknown as { rotateY: number }).rotateY) % 360;

        if (
          (cardRotation >= 0 && cardRotation <= 90) ||
          (cardRotation >= 270 && cardRotation <= 359)
        ) {
          card.setTexture(frontTexture);
        } else {
          card.setTexture(Image.CardBack);
        }
      },

      onComplete() {
        isFlipping = false;

        if (typeof callbackComplete === 'function') {
          callbackComplete();
        }
      },
    });
  }

  function destroy() {
    scene.add.tween({
      targets: [card],
      y: card.y - 1000,
      easing: Phaser.Math.Easing.Elastic.In,
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
  };
}
