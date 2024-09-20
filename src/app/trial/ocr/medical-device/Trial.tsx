import { CButton, CTRow } from '@base/index';
import { CInput } from '@base/input';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import { PopupLoading } from '@base/loading/PopupLoading';
import CTable from '@base/table';
import { useToast } from '@hooks/useToast';
import RadioChecked from '@images/RadioChecked.png';
import RadioDefault from '@images/RadioDefault.png';
import Upload from '@images/Upload.svg';
import { AIFeature, HTTPStatusCode, MedicalDeviceMeasureFunctions, MedicalDeviceStatusCode, Palette, ToastPosition, ToastType } from '@models/enum';
import { RootState } from '@models/rootReducer';
import { AxiosResponse } from 'axios';
import React, { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Image as ImageRB } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { FORMAT_IMAGE_TYPE } from '../../../../common/utils/constants';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { AIAPIKey } from '../../../dashboard/model';
import { noticeFromAI, requestOCRMedicalDevice, uploadPresignedUrl } from '../../api';
import { AINoticeOCRMedicalDevice, MedicalDevice } from '../../model';
import { SectionContainer } from '../../shared/SectionContainer';
import { MedicalDeviceDescription } from './Description';
import { MEDICAL_DEVICE_OCR_FUNCTIONS } from './constant';
import style from './medicalDevice.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  remaining: number | null;
  trialAPIKey?: AIAPIKey;
  getTrialTurn: (featureId: AIFeature) => void;
}

export const MedicalDeviceTrial: FC<Props> = (props) => {
  const { remaining, trialAPIKey, getTrialTurn } = props;
  const { t } = useTranslation();
  const { showToast } = useToast();

  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const inputFile = useRef<HTMLInputElement>(null);

  const [measureFunctions, setMeasureFunctions] = useState(MEDICAL_DEVICE_OCR_FUNCTIONS);
  const [selectedMeasureFunction, setSelectedMeasureFunction] = useState<string>(MedicalDeviceMeasureFunctions.BP);
  const [loadingExtractionResult, setLoadingExtractionResult] = useState<boolean>(false);
  const [extractionResult, setExtractionResult] = useState<MedicalDevice>({});
  const [resultImage, setResultImage] = useState<string>('');
  const [openRequirement, setOpenRequirement] = useState<boolean>(false);

  const TABLE_HEADER = [t('fieldName'), t('value')];

  const toggleRequirement = () => setOpenRequirement(!openRequirement);

  const selectOCRMeasureFunction = (ocrMeasureFunction: MedicalDeviceMeasureFunctions) => {
    setSelectedMeasureFunction(ocrMeasureFunction);
  };

  const resetAllState = () => {
    if (inputFile.current) {
      inputFile.current.value = '';
    }
    setLoadingExtractionResult(false);
    setResultImage('');
    setExtractionResult({});
  };

  const convertResponseToResult = (responseNotice: AxiosResponse<AINoticeOCRMedicalDevice>) => {
    getTrialTurn(trialAPIKey?.ai_feature?.id as AIFeature);

    const resultNotice = responseNotice.data.result;
    if (!resultNotice) {
      resetAllState();
      Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
      return;
    }
    if (
      resultNotice.error_code === MedicalDeviceStatusCode.DEVICE_NOT_IN_TEMPLATE ||
      resultNotice.error_code === MedicalDeviceStatusCode.DEVICE_NOT_SUPPORT_TENANT
    ) {
      resetAllState();
      Confirm.danger({
        title: t('cfm.extractFail.title'),
        content: t('cfm.extractFail.content'),
        labelBtnCfm: t('btn.understood'),
        labelBtnCancel: t('btn.uploadAnotherImage'),
        onCancel: openFileInput,
      });
      return;
    }
    if (resultNotice.error_code === MedicalDeviceStatusCode.SUCCESS) {
      const data = resultNotice.data;
      setLoadingExtractionResult(false);
      setExtractionResult(data.result);
      setResultImage(data.bounding_document || '');
    } else {
      resetAllState();
      Confirm.danger({
        title: t('cfm.extractFail.title'),
        content: t('cfm.extractFail.content'),
        labelBtnCfm: t('btn.understood'),
        labelBtnCancel: t('btn.reviewRequirement'),
        onCancel: () => setOpenRequirement(true),
      });
    }
  };

  const detectOCRMedicalDevice = async (selectedFile: File) => {
    if (!tenantId || !trialAPIKey) return;
    setLoadingExtractionResult(true);
    try {
      const currentApiKey = trialAPIKey.id;
      const resOCRMedicalDevice = await requestOCRMedicalDevice(tenantId, currentApiKey, selectedMeasureFunction);
      if (resOCRMedicalDevice.data) {
        const formData = new FormData();
        const presignedUrl = resOCRMedicalDevice.data.pre_signed_url;
        const presignedBody = resOCRMedicalDevice.data.pre_signed_body;
        for (const key in presignedBody) {
          formData.append(key, presignedBody[key]);
        }
        formData.append('file', selectedFile);
        const resPresignedUrl = await uploadPresignedUrl(presignedUrl, formData);
        if (resPresignedUrl.status === HTTPStatusCode.NO_CONTENT) {
          const responseNotice = await noticeFromAI<AINoticeOCRMedicalDevice>(tenantId, resOCRMedicalDevice.data.transaction_id, currentApiKey);
          convertResponseToResult(responseNotice);
        }
      }
    } catch (error) {
      resetAllState();
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    }
  };

  const handleChangeImage = async (files: FileList | null) => {
    if (remaining !== null && remaining === 0) {
      Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
    } else {
      if (!files || !files.length) return;
      const selectedFile = files[0];
      const allowedFormats = FORMAT_IMAGE_TYPE;

      if (!allowedFormats.includes(selectedFile.type)) {
        return showToast({
          type: ToastType.ERROR,
          position: ToastPosition.TOP_RIGHT,
          title: t('toast.error.uploadImage'),
          message: t('toast.error.imageFormat'),
        });
      }
      const img = new Image();
      img.src = window.URL.createObjectURL(selectedFile);

      img.onload = async function () {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        if (naturalWidth < 416 || naturalHeight < 416) {
          showToast({
            type: ToastType.ERROR,
            title: t('toast.error.uploadImage'),
            message: t('toast.error.imageSize'),
          });
          return;
        } else {
          await detectOCRMedicalDevice(selectedFile);
        }
      };
    }
  };

  const openFileInput = () => {
    if (remaining !== null && remaining === 0) {
      Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
    } else {
      inputFile.current && inputFile.current.click();
    }
  };

  useEffect(() => {
    const updateFunctions = measureFunctions.map((func, idx) => ({
      ...func,
      isActive: func.measure === selectedMeasureFunction,
    }));
    setMeasureFunctions(updateFunctions);
  }, [selectedMeasureFunction]);

  return (
    <div className={style.container}>
      <PopupLoading isOpen={loadingExtractionResult} title={t('extractingData')} content={t('doneSoon')} />
      {Object.keys(extractionResult).length === 0 ? (
        <>
          <MedicalDeviceDescription isOpen={openRequirement} toggle={toggleRequirement} />
          <hr className={style.line} />
          <SectionContainer title={t('chooseFunction')} className='mb-3'>
            <div className={style.functions}>
              {measureFunctions.map((func, index) => (
                <button key={index} className={style.function} onClick={() => selectOCRMeasureFunction(func.measure)}>
                  <div className={style.image}>
                    <ImageRB src={func.image} width={182} height={144} />
                  </div>
                  <div className={`${style.select} ${func.isActive && style.isActive}`}>
                    <ImageRB src={func.isActive ? RadioChecked : RadioDefault} />
                    <p className={style.label}>{t(func.label)}</p>
                  </div>
                </button>
              ))}
            </div>
          </SectionContainer>
          <SectionContainer title={t('uploadImage')}>
            <FileDragAndDrop className={style.dragDropImage} onFileDropped={(e) => handleChangeImage(e.dataTransfer.files)}>
              <ImageRB src={Upload} width={56} height={56} />
              <div className={style.fileContainer}>
                <p>{t('dragAndDropPhoto')}</p>
                <p>{t('or')}</p>
                <CButton className={style.textLabel} label={t('uploadImage')} onClick={openFileInput} />
              </div>
              <div className={style.note}>
                {t('note')}: {t('uploadImage.medicalDevice.note')}
              </div>
              <div className={style.note}>{t('uploadImage.secondNote')}</div>
              <CInput
                iref={inputFile}
                id='md-upload-image'
                type='file'
                name='file'
                className='d-none'
                accept='.png, .jpg, .jpeg'
                value={resultImage}
                onChange={(e) => handleChangeImage(e.currentTarget.files)}
              />
            </FileDragAndDrop>
          </SectionContainer>
        </>
      ) : (
        <>
          <div className={style.turnBack} onClick={resetAllState}>
            <SVGIcon icon='ArrowLeft' className='mb-1' color={Palette.BLACK} size={16} />
            <p className='ml-1'>{t('btn.back')}</p>
          </div>
          <div className={style.resultContainer}>
            <SectionContainer title={t('uploadedImage')}>
              <ImageRB src={resultImage} className={style.imageContainer} width='100%' />
            </SectionContainer>
            <div className={style.divider} />
            <SectionContainer title={t('extractionResult')}>
              <div className={style.tableContainer}>
                <CTable>
                  <thead>
                    <CTRow header data={TABLE_HEADER} />
                  </thead>
                  <tbody>
                    {Object.entries(extractionResult).map(([key, value], index) => (
                      <CTRow key={index} data={[t(key), <p className={style.value}>{value}</p>]} />
                    ))}
                  </tbody>
                </CTable>
              </div>
            </SectionContainer>
          </div>
        </>
      )}
    </div>
  );
};
