import { createRef, Text, useScene } from 'phaser-jsx';
import type { RefObject } from 'react';

import { Audio } from '../constants';

interface Props {
  onClick: () => void;
  ref: (ref: RefObject<Phaser.GameObjects.Text | null>) => void;
}

export function Win(props: Props) {
  const scene = useScene();
  const ref = createRef<Phaser.GameObjects.Text>();
  props.ref(ref);

  return (
    <Text
      x={scene.sys.game.scale.width / 2}
      y={-1000}
      text="YOU WIN"
      style={{
        align: 'center',
        strokeThickness: 4,
        fontSize: 40,
        fontStyle: 'bold',
        color: '#8c7ae6',
      }}
      originX={0.5}
      originY={0.5}
      depth={3}
      onPointerOver={() => {
        ref.current!.setColor('#ff7f50');
        scene.input.setDefaultCursor('pointer');
      }}
      onPointerOut={() => {
        ref.current!.setColor('#8c7ae6');
        scene.input.setDefaultCursor('default');
      }}
      onPointerDown={() => {
        scene.sound.play(Audio.Whoosh, { volume: 1.3 });
        scene.add.tween({
          targets: ref.current!,
          ease: Phaser.Math.Easing.Bounce.InOut,
          y: -1000,
          onComplete: () => {
            props.onClick();
          },
        });
      }}
      ref={ref}
    />
  );
}
