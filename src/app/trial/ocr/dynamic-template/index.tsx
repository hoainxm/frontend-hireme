import React, { FC, useEffect, useRef, useState } from 'react';
import { RemainRequestCard } from '@base/card';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { TrialContentLayout } from '@layout/trial-content-layout';
import { useTranslation } from 'react-i18next';
import style from './dynamicTemplate.module.scss';
import {
  ButtonVariant,
  DocumentType,
  DynamicStatusCode,
  DynamicTemplateAction,
  HTTPStatusCode,
  PageURL,
  ToastPosition,
  ToastType,
} from '@models/enum';
import { SectionContainer } from '../../shared/SectionContainer';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import { Form, Image } from 'react-bootstrap';
import CButton from '@base/button';
import { CInput } from '@base/input';
import Upload from '@images/Upload.svg';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { useToast } from '@hooks/useToast';
import { FORMAT_IMAGE_TYPE } from '../../../../common/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@models/rootReducer';
import { PopupLoading } from '@base/loading/PopupLoading';
import BlankFrame from '@base/blank-frame';
import Trash from '@icon/Empty.svg';
import Edit from '@icon/EditBlue.svg';
import Delete from '@icon/TrashBin.svg';
import Plus from '@icon/Add.svg';
import PlusGray from '@icon/AddGray.svg';
import { useHistory } from 'react-router-dom';
import { getDynamicTemplateAPI, noticeFromAI, requestCreateDynamicTemplate, uploadPresignedUrl } from '../../api';
import { AINoticeDynamicImage, ITemplate } from 'app/trial/model';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { WebcamModal } from '../../shared/WebcamModal';
import { dataUrlToFile } from '../../../../common/utils/common';
import { TruncatedTextTooltip } from '@base/tool-tip/TruncatedTextTooltip';
import { ListDynamicTemplatePopup } from './ListDynamicTemplatePopup';
import Loading from '@base/loading';
import { UserGuide } from './UserGuide';

interface Props {}

export const DynamicTemplate: FC<Props> = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { showToast } = useToast();
  const { trialAPIKey, remaining } = useGetRemainTurn();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);
  const [positionChecked, setPositionChecked] = useState<number>();
  const [openWebcam, setOpenWebcam] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleWebcam = () => setOpenWebcam(!openWebcam);

  const MAP_TITLE_DOCUMENT_TYPE = {
    [DocumentType.LCD]: t('product.ocr.type.lcd'),
    [DocumentType.PAPER]: t('product.ocr.type.paper'),
  };
  const resetAllState = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    setIsProcessing(false);
  };

  const detectWebcamImage = async (imgSrc: string) => {
    const fileImageWebcam = await dataUrlToFile(imgSrc, 'webcam-image');
    setOpenWebcam(false);
    await requestOCRTemplateTask(fileImageWebcam);
  };

  const showPopupDeleteTemplate = (template: ITemplate) => {
    Confirm.delete({
      title: t('product.ocr.deleteDynamicTemplate'),
      content: t('product.ocr.confirmDelete.content'),
      labelBtnCfm: t('btn.remove'),
      labelBtnCancel: t('btn.cancel'),
      onConfirm: () => handleDeleteTemplate(template),
    });
  };

  const handleDeleteTemplate = async (template: ITemplate) => {
    if (!tenantId || !trialAPIKey) return;

    try {
      setIsLoading(true)
      const resDeleteTemplate = await requestCreateDynamicTemplate(
        tenantId,
        trialAPIKey.id,
        DynamicTemplateAction.DELETE,
        template.document_type,
        template.template_name
      );
      if (resDeleteTemplate.data) {
        const responseNotice = await noticeFromAI<AINoticeDynamicImage>(tenantId, resDeleteTemplate.data.transaction_id, trialAPIKey.id);
        if (!responseNotice.data.error_code && responseNotice.data.result.error_code === DynamicStatusCode.SUCCESS) {
          showToast({
            type: ToastType.SUCCESS,
            position: ToastPosition.TOP_RIGHT,
            title: t('product.ocr.deleteDynamicTemplate'),
            message: t('product.ocr.success.deleteDynamicTemplate'),
          });
          getDynamicTemplate(tenantId);
        } else if (!responseNotice.data.result) {
          Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
        } else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      }
    } catch (error) {
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const requestOCRTemplateTask = async (selectedFile: File) => {
    if (positionChecked === undefined) {
      Alert.warning({
        title: t('product.error.title.notSelectTemplate'),
        content: t('product.error.content.notSelectTemplate'),
        labelBtnCfm: t('btn.understood'),
      });
      resetAllState();
      return;
    }
    if (!tenantId || !trialAPIKey) return;
    setIsProcessing(true);
    try {
      const templateChecked = templates[positionChecked];
      const resOCRPrescription = await requestCreateDynamicTemplate(
        tenantId,
        trialAPIKey.id,
        DynamicTemplateAction.RECOGNIZE,
        templateChecked.document_type,
        templateChecked.template_name
      );
      if (resOCRPrescription.data && inputFileRef.current?.files?.[0]) {
        const formData = new FormData();
        const presignedUrl = resOCRPrescription.data.pre_signed_url;
        const presignedBody = resOCRPrescription.data.pre_signed_body;
        for (const key in presignedBody) {
          formData.append(key, presignedBody[key]);
        }
        formData.append('file', inputFileRef.current.files[0]);
        const resPresignedUrl = await uploadPresignedUrl(presignedUrl, formData);
        if (resPresignedUrl.status === HTTPStatusCode.NO_CONTENT) {
          const responseNotice = await noticeFromAI<AINoticeDynamicImage>(tenantId, resOCRPrescription.data.transaction_id, trialAPIKey.id);

          if (!responseNotice.data.error_code && responseNotice.data.result.error_code === DynamicStatusCode.SUCCESS)
            history.push({ pathname: PageURL.OCR_DYNAMIC_TEMPLATE_RESULT, state: responseNotice.data.result });
          else if (!responseNotice.data.result) {
            Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
          } else
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
      resetAllState();
      setIsProcessing(false);
    }
  };

  const changeImage = async (files: FileList | null) => {
    if (remaining !== null && remaining === 0) {
      Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
      return;
    }
    if (!files || !files.length) return;
    const selectedFile = files[0];
    const allowedFormats = FORMAT_IMAGE_TYPE;

    if (!allowedFormats.includes(selectedFile.type)) {
      showToast({
        type: ToastType.ERROR,
        position: ToastPosition.TOP_RIGHT,
        title: t('toast.error.uploadImage'),
        message: t('toast.error.imageFormat'),
      });
      return;
    }
    await requestOCRTemplateTask(selectedFile);
  };

  const openFileInput = () => {
    if (remaining !== null && remaining === 0) {
      Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
      return;
    }
    inputFileRef.current && inputFileRef.current.click();
  };

  const getDynamicTemplate = (tenantId: string) => {
    setIsLoading(true);
    getDynamicTemplateAPI(tenantId).then((res) => {
      setTemplates(res.data);
    }).finally(() => setIsLoading(false));
  };

  const handleAddTemplate = (template: ITemplate) => {
    const positionExist = templates.findIndex(tem => tem.template_name === template.template_name)
    if (positionExist !== -1) {
      setPositionChecked(positionExist);
      return;
    }
    if (templates.length === 5) {
      templates[4] = template;
      setPositionChecked(4);
    } else {
      templates.push(template);
      setPositionChecked(templates.length - 1);
    }
    
    setTemplates(Array.from(templates))
  };

  useEffect(() => {
    if (tenantId) getDynamicTemplate(tenantId);
  }, [tenantId]);

  return (
    <TrialContentLayout
      title={t('product.ocr.dynamicTemplate')}
      icon={<UserGuide />}
      btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}
    >
      <ListDynamicTemplatePopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleChooseTemplate={handleAddTemplate}
        handleDeleteTemplate={showPopupDeleteTemplate}
      />
      <Loading isOpen={isLoading} />
      <PopupLoading isOpen={isProcessing} title={t('extractingData')} content={t('doneSoon')} />
      <SectionContainer title={t('product.ocr.chooseTemplate')}>
        <div className={style.chosenTemplate}>
          <div className={style.action}>
            <p>
              <span>{t('product.ocr.createdTemplate')}</span>{' '}
              <span>
                {t('product.ocr.freeTemplateRemaining', {
                  remaining: 5 - templates.length,
                  total: 5,
                })}
              </span>
            </p>
            <CButton
              disabled={templates.length >= 5}
              variant={ButtonVariant.OUTLINE}
              onClick={() => history.push(PageURL.OCR_DYNAMIC_TEMPLATE_CREATE)}
            >
              <Image className='mr-2' src={templates.length < 5 ? Plus : PlusGray} />
              {t('product.ocr.createTemplate')}
            </CButton>
          </div>
          <div className={style.cardTemplateList}>
            {templates.map((item, index) => (
              <div key={index} className={`${style.cardTemplate} ${index === positionChecked && style.active}`}>
                {(item.created_status !== 0 || item.updated_status !== 0) && (
                  <div className={`${style.tag} ${item.created_status && !item.updated_status && style.new}`}>
                    {t(item.created_status && !item.updated_status ? t('new') : t('latest'))}
                  </div>
                )}
                <div className={style.image}>
                  <Image src={item.template_image} />
                </div>

                <label className={style.radioBtn} htmlFor={`radio-${index}`}>
                  <Form.Check onChange={(e) => setPositionChecked(index)} checked={positionChecked === index} custom type='radio' name='template' id={`radio-${index}`} />
                  <TruncatedTextTooltip placement='bottom' tooltipContent={item.template_name}>{item.template_name}</TruncatedTextTooltip>
                </label>
                <div className={style.type}>{t('product.ocr.template', { name: MAP_TITLE_DOCUMENT_TYPE[item.document_type] })}</div>
                <div className={style.date}>{t('product.ocr.created', { date: item.created_time })}</div>
                <hr />
                <div className={style.editBtn}>
                  <Image src={Edit} onClick={() => history.push({ pathname: PageURL.OCR_DYNAMIC_TEMPLATE_UPDATE, state: item })} />
                  <Image src={Delete} onClick={() => showPopupDeleteTemplate(item)} />
                </div>
              </div>
            ))}
          </div>
          <div className={style.otherTemplateBtn} onClick={() => setIsOpen(true)}>
            {t('product.ocr.otherTemplate')}
          </div>
          {templates.length === 0 && <BlankFrame image={Trash} title={t('field.hint.no_data')} />}
        </div>
      </SectionContainer>
      <SectionContainer title={t('uploadImage')}>
        <WebcamModal isOpen={openWebcam} toggle={toggleWebcam} detectWebcamImage={detectWebcamImage} />
        <FileDragAndDrop className={style.dragDropImage} onFileDropped={(e) => changeImage(e.dataTransfer.files)}>
          <Image src={Upload} width={56} height={56} />
          <div className={style.fileContainer}>
            <p>{t('dragAndDropPhoto')}</p>
            <p>{t('or')}</p>
            <div className='d-flex align-items-center'>
              <CButton type='button' className={style.textLabel} onClick={openFileInput}>
                <div className='d-flex align-items-center'>
                  <SVGIcon className='ml-0' icon='Image' size={16} />
                  <p className='ml-2'>{t('uploadImage')}</p>
                </div>
              </CButton>
            </div>
          </div>
          <div className={style.note}>
            {t('note')}: {t('uploadImage.inbody.note')}
          </div>
          <div className={style.note}>{t('uploadImage.secondNote')}</div>
          <CInput
            iref={inputFileRef}
            id='inbody-upload-image'
            type='file'
            name='file'
            className='d-none'
            accept='.png, .jpg, .jpeg'
            onChange={(e) => changeImage(e.currentTarget.files)}
          />
        </FileDragAndDrop>
      </SectionContainer>
    </TrialContentLayout>
  );
};
