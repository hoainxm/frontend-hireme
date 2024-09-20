import { CRectConfig } from 'app/trial/model';
import Konva from 'konva';
import React, { FC, useRef, useState } from 'react';
import { Circle, Rect, Text, Transformer } from 'react-konva';

interface Props {
  isSelected?: boolean;
  shapeProps: CRectConfig;
  onChange?: (value: CRectConfig) => void;
  onSelect?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
  handleGrabbing?: (value: boolean, rect: Konva.RectConfig) => void;
}

export const Rectangle: FC<Props> = (props: Props) => {
  const { isSelected = false, shapeProps, onSelect, onChange } = props;
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const handleGrabbing = (value: boolean) => {
    setIsGrabbing(value);
    props?.handleGrabbing && props.handleGrabbing(value, shapeProps);
  };

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const onTransformEnd = (evt: Konva.KonvaEventObject<Event>) => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = shapeRef.current;
    if (node && onChange) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // we will reset it back
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        ...shapeProps,
        x: node.x(),
        y: node.y(),
        // set minimal value
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(node.height() * scaleY),
      });
    }
  };

  const fill = shapeProps.id ? 'rgba(42, 126, 249, 0.2)' : undefined;
  const stroke = shapeProps.id ? 'rgba(42, 126, 249, 1)' : 'rgba(255, 140, 0, 1)';

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
        {...shapeProps}
        onDragStart={() => handleGrabbing(true)}
        onDragEnd={(e) => {
          onChange && onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
          handleGrabbing(false);
        }}
        onTransformEnd={onTransformEnd}
      />
      {!isGrabbing && !isSelected && shapeProps.id && <Circle x={shapeProps.x} y={shapeProps.y} radius={8} fill={stroke} />}
      {!isGrabbing && !isSelected && shapeProps.id && (
        <Text
          x={(shapeProps.x || 0) - 8}
          y={(shapeProps.y || 0) - 8}
          text={shapeProps.id}
          align='center'
          width={16}
          height={16}
          verticalAlign='middle'
          fontSize={10}
          fontFamily='SVN-Gilroy'
          fill='white'
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          anchorStroke={stroke}
          borderStroke={stroke}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
          onDragStart={() => handleGrabbing(true)}
          onDragEnd={() => handleGrabbing(false)}
          onTransformStart={() => handleGrabbing(true)}
          onTransformEnd={() => handleGrabbing(false)}
        />
      )}
    </>
  );
};
