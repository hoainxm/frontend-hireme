import React, { FC, useEffect, useState } from 'react';
import { RemainRequestCard } from '@base/card';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { TrialContentLayout } from '@layout/trial-content-layout';
import { useTranslation } from 'react-i18next';
import style from './dynamicTemplate.module.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { AIDynamicTemplateResult, CRectConfig } from 'app/trial/model';
import { PageURL } from '@models/enum';
import CTable from '@base/table';
import { CTRow } from '@base/index';
import { Layer, Stage, Image as KonvaImage } from 'react-konva';
import { Rectangle } from '@base/draw/Rectangle';
import useImage from 'use-image';
import { TextTooltip } from '@base/tool-tip/TextTooltip';

interface Props {}

export const ShowDynamicResult: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { remaining } = useGetRemainTurn();
  const [scale, setScale] = useState(1);
  const stageRef = React.useRef(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  const TABLE_HEADER = ['ID', t('product.ocr.tagName'), t('product.ocr.coordinates'), t('value')];

  const data = location.state as AIDynamicTemplateResult;
  if (!data) history.push(PageURL.OCR_DYNAMIC_TEMPLATE);

  const [img] = useImage(data.data.align_document);

  const handleSortLabel = (a: [number, number, number, number], b: [number, number, number, number]) => {
    if (a[1] === b[1]) {
      return a[0] - b[0];
    } else return a[1] - b[1];
  };

  const getRectangles = () => {
    return data.data.result
      .filter((item) => item.points)
      .map<CRectConfig>((item) => ({
        x: item.points[0],
        y: item.points[1],
        width: item.points[2] - item.points[0],
        height: item.points[3] - item.points[1],
        index: item.index,
        id: item.index.toString(),
        name: item.name,
      }));
  };

  const calcRatioImage = () => {
    if (canvasContainerRef.current && img) {
      const scaleX = canvasContainerRef.current.clientWidth / img.width;
      const scaleY = canvasContainerRef.current.clientHeight / img.height;
      setScale(scaleX > scaleY ? scaleY : scaleX);
    }
  };

  useEffect(() => {
    calcRatioImage();
    window.addEventListener('resize', calcRatioImage);
    return () => {
      window.history.replaceState({}, '');
    };
  });

  return (
    <TrialContentLayout
      backTo={PageURL.OCR_DYNAMIC_TEMPLATE}
      title={data?.data?.template_name || ""}
      btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}
    >
      <div className={style.resultTemplateImage}>
        <div className={style.imageTemplate}>
          <h4>{t('product.ocr.tagList')}</h4>
          <div className={style.canvasContainer} ref={canvasContainerRef}>
            <Stage
              width={canvasContainerRef.current?.clientWidth}
              height={canvasContainerRef.current?.clientHeight}
              ref={stageRef}
              scaleX={scale}
              scaleY={scale}
              x={0}
              y={0}
              className='position-absolute'
            >
              <Layer>{img && <KonvaImage image={img} x={0} y={0} />}</Layer>
              <Layer>
                {getRectangles().map((rect, i) => {
                  return <Rectangle key={i} shapeProps={rect} isSelected={false} />;
                })}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className={style.divider} />
        <div className={style.templateInfo}>
          <h4>{t('product.ocr.resultDynamicTemplate')}</h4>
          <CTable responsive maxHeight={650}>
            <thead>
              <CTRow header cellClass='text-center' positionApplyCellClass={3} data={TABLE_HEADER} />
            </thead>
            <tbody>
              {data.data.result
                .filter((item) => item.points)
                .sort((a, b) => handleSortLabel(a.points, b.points))
                .map((item, index) => (
                  <CTRow
                    key={index}
                    data={[
                      item.index,
                      item.name,
                      `[${item.points[0]}, ${item.points[1]}, ${item.points[2]}, ${item.points[3]}]`,
                      ,
                      <TextTooltip
                        visible={true}
                        placement='bottom'
                        tooltipContent={item.value}
                        children={item.value}
                        className={style.valueTooltip}
                      />,
                    ]}
                  />
                ))}
            </tbody>
          </CTable>
        </div>
      </div>
    </TrialContentLayout>
  );
};
