import { createRef, Text, useScene } from 'phaser-jsx';

import { Audio } from '../constants';

interface Props {
  onClick: () => void;
}

export function Title(props: Props) {
  const scene = useScene();
  const ref = createRef<Phaser.GameObjects.Text>();

  return (
    <Text
      x={scene.sys.game.scale.width / 2}
      y={scene.sys.game.scale.height / 2}
      text={['Memory Card Game', 'Click to Play'].join('\n')}
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
      addedToScene={() => {
        // title tween like retro arcade
        scene.add.tween({
          targets: ref.current!,
          duration: 800,
          ease: (value: number) => value > 0.8,
          alpha: 0,
          repeat: -1,
          yoyo: true,
        });
      }}
      onPointerOver={() => {
        ref.current!.setColor('#9c88ff');
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
            if (!scene.sound.get(Audio.ThemeSong)) {
              scene.sound.play(Audio.ThemeSong, { loop: true, volume: 0.5 });
            }
            props.onClick();
          },
        });
      }}
      ref={ref}
    />
  );
}
