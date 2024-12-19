import { createRef, type Ref, Text, useScene } from 'phaser-jsx';

interface Props {
  onClick: () => void;
  ref: (ref: Ref<Phaser.GameObjects.Text>) => void;
}

export function Lose(props: Props) {
  const scene = useScene();
  const ref = createRef<Phaser.GameObjects.Text>();
  props.ref(ref);

  return (
    <Text
      x={scene.sys.game.scale.width / 2}
      y={-1000}
      text={['GAME OVER', 'Click to restart'].join('\n')}
      style={{
        align: 'center',
        strokeThickness: 4,
        fontSize: 40,
        fontStyle: 'bold',
        color: '#ff0000',
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
