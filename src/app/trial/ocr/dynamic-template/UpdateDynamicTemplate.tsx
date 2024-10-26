import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { CInput, CInputHint } from '@base/input';
import { TrialContentLayout } from '@layout/trial-content-layout';
import { DynamicStatusCode, DynamicTemplateAction, PageURL, ToastPosition, ToastType } from '@models/enum';
import { Form, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CTable from '@base/table';
import { BlankFrame, CButton, CTRow } from '@base/index';
import Empty from '@icon/Empty.svg';
import Trash from '@icon/TrashBin.svg';
import { AINoticeDisplayDynamicImage, CRectConfig, DynamicForm, DynamicTemplateForm, ITemplate } from 'app/trial/model';
import { ImageTemplateBehavior } from './ImageTemplateBehavior';
import style from './dynamicTemplate.module.scss';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { getDetailDynamicTemplateAPI, noticeFromAI, requestCreateDynamicTemplate } from '../../api';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { useLocation } from 'react-router-dom';
import { PopupLoading } from '@base/loading/PopupLoading';
import { useToast } from '@hooks/useToast';
import useBlockHistory from '@hooks/useBlockHistory';

interface Props {}

export const UpdateDynamicTemplate: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { trialAPIKey } = useGetRemainTurn();
  const location = useLocation();
  const TABLE_HEADER = ['ID', t('product.ocr.tagName'), t('product.ocr.coordinates'), t('field.action')];
  const [template, setTemplate] = React.useState<ITemplate>();
  const [rectangles, setRectangles] = React.useState<Array<CRectConfig>>([]);
  const [selectedRect, setSelectRect] = React.useState<CRectConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit, register, getValues, errors, setValue } = useForm<DynamicForm>();
  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const idNumberRef = useRef(0);
  const { blockHistory, history } = useBlockHistory({
    handleConfirm: (confirmLeave) => {
      Confirm.warning(
        <>{t('product.title.unsavedTitle')}</>,
        <>{t('product.content.unsavedEditTitle')}</>,
        () => {},
        confirmLeave,
        t('btn.continueEditTemplate'),
        t('btn.exitPage')
      );
    },
  });

  const data = location.state as ITemplate;

  const handleSortLabel = (a: CRectConfig, b: CRectConfig) => {
    if (a.y === b.y) {
      return a.x - b.x;
    } else return a.y - b.y;
  };

  const handleRemoveLabel = (e: MouseEvent<HTMLImageElement>, rectangle: CRectConfig) => {
    e.stopPropagation();
    setRectangles((prev) => prev.filter((rect) => rect !== selectedRect));
    if (rectangle === selectedRect) setSelectRect(null);
  };

  const getContentRegister = (data: ITemplate): DynamicTemplateForm => {
    const result: DynamicTemplateForm = {
      display_image: data.template_image,
      org_screen_size: data.img_size,
      label_box: [],
      un_label: [],
      num_img: 1,
      new_template_name: getValues('name'),
    };
    rectangles.forEach((rect) => {
      if (rect.name && rect.id) {
        result.label_box.push({
          name: [rect.name],
          points: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
          value: '',
          index: parseInt(rect.id),
        });
      }
    });
    return result;
  };

  const onInvalid: SubmitErrorHandler<DynamicForm> = (_, event) => {
    event?.target.classList.add('wasvalidated');
  };

  const onValid: SubmitHandler<DynamicForm> = async (data) => {
    if (!tenantId || !trialAPIKey || !template) return;

    setIsLoading(true);
    try {
      const contentRegister = getContentRegister(template);
      if (!contentRegister.label_box.length) {
        Alert.warning({
          title: t('product.error.title.notLabel'),
          content: t('product.error.content.notLabel'),
          labelBtnCfm: t('btn.understood'),
        });
        return;
      }
      const res = await requestCreateDynamicTemplate(
        tenantId,
        trialAPIKey.id,
        DynamicTemplateAction.UPDATE,
        template.document_type,
        template.template_name,
        contentRegister
      );
      if (res.data) {
        const responseNotice = await noticeFromAI<AINoticeDisplayDynamicImage>(tenantId, res.data.transaction_id, trialAPIKey.id);
        if (!responseNotice.data.error_code && responseNotice.data.result.error_code === DynamicStatusCode.SUCCESS) {
          showToast({
            type: ToastType.SUCCESS,
            position: ToastPosition.TOP_RIGHT,
            title: t('product.ocr.updateDynamicTemplate'),
            message: t('product.ocr.success.updateDynamicTemplate'),
          });
          blockHistory.isBlock = false;
          history.push(PageURL.OCR_DYNAMIC_TEMPLATE);
        } else if (!responseNotice.data.result) {
          Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
        } else {
          Confirm.danger({
            title: t('cfm.extractFail.title'),
            content: t('cfm.extractFail.content'),
            labelBtnCfm: t('btn.understood'),
            labelBtnCancel: t('btn.reviewRequirement'),
          });
        }
      }
    } catch (error) {
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDynamicTemplateRes = (template: ITemplate) => {
    setRectangles(
      template.label_box.map((label) => {
        if (label.index > idNumberRef.current) idNumberRef.current = label.index;
        return {
          x: label.points[0],
          y: label.points[1],
          width: label.points[2] - label.points[0],
          height: label.points[3] - label.points[1],
          id: label.index.toString(),
          name: label.name[0],
        };
      })
    );
  };

  const getDynamicTemplateDetail = (id: number) => {
    if (!tenantId) return;
    getDetailDynamicTemplateAPI(tenantId, id).then((res) => {
      const template: ITemplate = res.data[0];
      setTemplate(template);
      handleImageDynamicTemplateRes(template);
      setValue('name', template.template_name);
    });
  };

  useEffect(() => {
    if (data?.id) getDynamicTemplateDetail(data.id);
    else history.push(PageURL.OCR_DYNAMIC_TEMPLATE);
  }, [tenantId]);

  const labels = rectangles.filter((rect) => rect.name).sort(handleSortLabel);

  return (
    <TrialContentLayout
      title={t('product.ocr.updateTemplate')}
      backTo={PageURL.OCR_DYNAMIC_TEMPLATE}
      btnGroup={<CButton form='create-dynamic-template' className={style.textLabel} label={t('btn.save')} />}
    >
      <PopupLoading isOpen={isLoading} title={t('extractingData')} content={t('doneSoon')} />
      <div className={style.createTemplate}>
        <ImageTemplateBehavior
          image={template?.template_image || ''}
          idNumberRef={idNumberRef}
          selectedRect={selectedRect}
          setSelectRect={setSelectRect}
          rectangles={rectangles}
          setRectangles={setRectangles}
        />
        <div className={style.divider} />
        <Form className={style.templateInfo} onSubmit={handleSubmit(onValid, onInvalid)} id='create-dynamic-template'>
          <h4>{t('product.ocr.templateInfo')}</h4>
          <Form.Group className='mb-4'>
            <Form.Label className='required'>{t('product.ocr.templateName')}</Form.Label>
            <CInput
              name='name'
              valid={!errors.name}
              iref={register({ required: 'field.error.notEmpty' })}
              placeholder={t('product.ocr.hint.templateName')}
            />
            {errors.name?.type === 'required' && <CInputHint className='validated'>{t('field.error.notEmpty')}</CInputHint>}
            {errors.name?.type === 'duplicated' && <CInputHint className='validated'>{t('product.error.duplicatedNameDynamic')}</CInputHint>}
          </Form.Group>
          <h4>{t('product.ocr.tagList')}</h4>
          <CTable responsive maxHeight={650}>
            <thead>
              <CTRow header cellClass='text-center' positionApplyCellClass={3} data={TABLE_HEADER} />
            </thead>
            <tbody>
              {labels.map((item, index) => (
                <CTRow
                  key={index}
                  onClick={() => setSelectRect(item)}
                  className={selectedRect?.id === item.id ? style.activeRow : ''}
                  data={[
                    item.id,
                    item.name,
                    `[${item.x.toFixed(0)}, ${item.y.toFixed(0)}, ${(item.x + item.width).toFixed(0)}, ${(item.y + item.height).toFixed(0)}]`,
                    <div className='text-center'>
                      <Image className={style.removeBtn} src={Trash} onClick={(e) => handleRemoveLabel(e, item)} />
                    </div>,
                  ]}
                />
              ))}
            </tbody>
          </CTable>
          {labels.length === 0 && (
            <div className={style.blankData}>
              <BlankFrame image={Empty} title={t('field.hint.no_data')} />
            </div>
          )}
        </Form>
      </div>
    </TrialContentLayout>
  );
};
