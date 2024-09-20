import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CInput, CInputHint } from '@base/input';
import CButton from '@base/button';
import { Form, Image } from 'react-bootstrap';
import Konva from 'konva';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import { Rectangle } from '@base/draw/Rectangle';
import { Html } from 'react-konva-utils';
import { CRectConfig } from 'app/trial/model';
import ZoomIn from '@icon/ZoomIn.svg';
import ZoomOut from '@icon/ZoomOut.svg';
import Close from '@icon/Close.svg';
import Trash from '@icon/TrashBin.svg';
import style from './dynamicTemplate.module.scss';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { MAX_ZOOM, MIN_ZOOM } from './constant';

interface Props {
  image: string;
  rectangles: Array<CRectConfig>;
  selectedRect: CRectConfig | null;
  idNumberRef: React.MutableRefObject<number>;
  setRectangles: React.Dispatch<React.SetStateAction<Array<CRectConfig>>>;
  setSelectRect: React.Dispatch<React.SetStateAction<CRectConfig | null>>;
}

type LabelForm = {
  name: string;
};

export const ImageTemplateBehavior: FC<Props> = (props: Props) => {
  const { rectangles, setRectangles, selectedRect, setSelectRect, idNumberRef } = props;
  const { t } = useTranslation();
  const [newRectangle, setNewRectangle] = useState<CRectConfig>();
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [img] = useImage(props.image);
  const { handleSubmit, register, reset, errors } = useForm<LabelForm>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });
  const [stageSpec, setStageSpec] = useState({
    scale: MIN_ZOOM,
    x: 0,
    y: 0,
  });
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef(null);

  const roundingRatio = (value: number) => {
    if (value > MAX_ZOOM) return MAX_ZOOM;
    else if (value < MIN_ZOOM) return MIN_ZOOM;
    return value;
  };

  const handleChangeZoom = (value: number) => {
    const stage: any = stageRef.current;
    const pointerPosition = stage?.getPointerPosition();

    if (stage && pointerPosition) {
      var center = {
        x: stage.width() / 2,
        y: stage.height() / 2,
      };
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: center.x / oldScale - stage.x() / oldScale,
        y: center.y / oldScale - stage.y() / oldScale,
      };

      const newScale = roundingRatio(value);

      setStageSpec({
        scale: newScale,
        x: (center.x / newScale - mousePointTo.x) * newScale,
        y: (center.y / newScale - mousePointTo.y) * newScale,
      });
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (e.evt.deltaY < 0 && stageSpec.scale >= MAX_ZOOM) return;
    else if (e.evt.deltaY > 0 && stageSpec.scale <= MIN_ZOOM) return;

    if (stage && pointerPosition) {
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      setStageSpec({
        scale: newScale,
        x: (pointerPosition.x / newScale - mousePointTo.x) * newScale,
        y: (pointerPosition.y / newScale - mousePointTo.y) * newScale,
      });
    }
  };

  const handleMouseUp = (event: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
    const pointPosition = event.target.getStage()?.getPointerPosition();

    if (newRectangle && pointPosition) {
      if (!newRectangle.width || !newRectangle.height) return setNewRectangle(undefined);
      const sx = newRectangle.x;
      const sy = newRectangle.y;
      const width = pointPosition.x - sx > 16 ? pointPosition.x - sx : 16;
      const height = pointPosition.y - sy > 16 ? pointPosition.y - sy : 16;
      const annotationToAdd: CRectConfig = {
        x: sx,
        y: sy,
        width,
        height,
        id: `${rectangles.length + 1}`,
      };
      rectangles.push(annotationToAdd);
      setNewRectangle(undefined);
      setRectangles(rectangles);
      setSelectRect(annotationToAdd);
    }
  };

  const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
    const pointPosition = event.target.getStage()?.getPointerPosition();
    if (!pointPosition) return;

    if (newRectangle) { 
      const sx = newRectangle.x;
      const sy = newRectangle.y;
      const width = pointPosition.x - sx > 16 ? pointPosition.x - sx : 16;
      const height = pointPosition.y - sy > 16 ? pointPosition.y - sy : 16;
      setNewRectangle({
        x: sx,
        y: sy,
        width,
        height,
      });
    }
  };

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
    const currentStage = e.target.getStage();
    const clickedOnEmpty = e.target === currentStage;
    const pointPosition = currentStage?.getPointerPosition();
    if (clickedOnEmpty || e.target.attrs.image) {
      if (selectedRect && selectedRect.id && !selectedRect.name) handleRemoveLabel();
      setSelectRect(null);
      reset();
      if (pointPosition && !newRectangle) {
        setNewRectangle({ x: pointPosition.x, y: pointPosition.y, width: 0, height: 0 });
      }
    }
  };

  const onInvalid: SubmitErrorHandler<LabelForm> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const onValid: SubmitHandler<LabelForm> = (data, event) => {
    if (selectedRect) {
      const id = ++idNumberRef.current;

      selectedRect.name = data.name;
      selectedRect.id = id.toString();
      reset();
    }
    setSelectRect(null);
  };

  const handleRemoveLabel = () => {
    if (selectedRect) setRectangles((prev) => prev.filter((rect) => rect !== selectedRect));
    setSelectRect(null);
  };

  useEffect(() => {
    window.addEventListener('resize', () => setStageSpec((prev) => ({ ...prev })));
  }, []);

  const ratioZoom = (roundingRatio(stageSpec.scale) * 100).toFixed(0);

  return (
    <div className={style.templateImage}>
      <div className={style.canvasContainer} ref={canvasContainerRef}>
        <Stage
          width={canvasContainerRef.current?.clientWidth}
          height={canvasContainerRef.current?.clientHeight}
          onMouseDown={onMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          ref={stageRef}
          scaleX={stageSpec.scale}
          scaleY={stageSpec.scale}
          x={stageSpec.x}
          y={stageSpec.y}
          className='position-absolute'
          onWheel={handleWheel}
        >
          <Layer>{img && <KonvaImage image={img} x={0} y={0} />}</Layer>
          <Layer>
            {rectangles.map((rect, i) => {
              return (
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect === selectedRect}
                  onSelect={() => {
                    setSelectRect(rect);
                  }}
                  onChange={(newAttrs: Konva.RectConfig) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs as CRectConfig;
                    setSelectRect(newAttrs as CRectConfig);
                    setRectangles(rects);
                  }}
                  handleGrabbing={(value) => setIsGrabbing(value)}
                />
              );
            })}

            {newRectangle && (
              <Rect
                x={newRectangle.x}
                y={newRectangle.y}
                width={newRectangle.width}
                height={newRectangle.height}
                fill='transparent'
                stroke='rgba(42, 126, 249, 1)'
              />
            )}

            {selectedRect && !isGrabbing && (
              <Html
                groupProps={{
                  x: selectedRect.x,
                  y: (selectedRect.y || 0) + (selectedRect.height || 0) + 8 / stageSpec.scale,
                  scale: { x: 1 / stageSpec.scale, y: 1 / stageSpec.scale },
                }}
                divProps={{ className: style.modelLabel }}
              >
                <Form onSubmit={handleSubmit(onValid, onInvalid)}>
                  <div>
                    <h4>{t(selectedRect.name ? 'product.ocr.editLabel' : 'product.ocr.addLabel')}</h4>
                    <Image src={Close} width={16} height={16} onClick={() => setSelectRect(null)} />
                  </div>
                  <Form.Group className='m-0'>
                    <Form.Label className='required'>{t('product.ocr.tagName')}</Form.Label>
                    <CInput
                      name='name'
                      autoFocus
                      valid={!errors.name}
                      iref={register({ required: true })}
                      defaultValue={selectedRect.name || ''}
                      placeholder={t('product.ocr.hint.tagName')}
                    />
                    {errors.name && <CInputHint className='validated'>{t('field.error.notEmpty')}</CInputHint>}
                  </Form.Group>
                  <div className='d-flex flex-row-reverse justify-content-between'>
                    <CButton className={style.textLabel} label={t('btn.save')} type='submit' />
                    <Image className={style.removeBtn} width={24} height={24} src={Trash} onClick={() => handleRemoveLabel()} />
                  </div>
                </Form>
              </Html>
            )}
          </Layer>
        </Stage>
      </div>
      <div className={style.zoomControl}>
        <Image width={16} height={16} src={ZoomOut} onClick={() => handleChangeZoom(stageSpec.scale - 0.2)} />
        <input
          min={MIN_ZOOM * 100}
          max={MAX_ZOOM * 100}
          onChange={(e) => handleChangeZoom(parseInt(e.target.value) / 100)}
          value={stageSpec.scale * 100}
          type='range'
        />
        <Image width={16} height={16} src={ZoomIn} onClick={() => handleChangeZoom(stageSpec.scale + 0.2)} />
        <span>{ratioZoom}%</span>
      </div>
    </div>
  );
};
