import CButton from '@base/button';
import { CTRow } from '@base/index';
import { CInput } from '@base/input';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import { PopupLoading } from '@base/loading/PopupLoading';
import CTable from '@base/table';
import { useToast } from '@hooks/useToast';
import Upload from '@images/Upload.svg';
import { AIFeature, HTTPStatusCode, InbodyStatusCode, Palette, ToastPosition, ToastType } from '@models/enum';
import { RootState } from '@models/rootReducer';
import { AxiosResponse } from 'axios';
import React, { FC, HTMLAttributes, useRef, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { FORMAT_IMAGE_TYPE, NOT_SET } from '../../../../common/utils/constants';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { AIAPIKey } from '../../../dashboard/model';
import { noticeFromAI, requestOCRInbody, uploadPresignedUrl } from '../../api';
import { AINoticeOCRInbody, Inbody } from '../../model';
import { RowWithExpand } from '../../shared/RowWithExpand';
import { SectionContainer } from '../../shared/SectionContainer';
import { InbodyDescription } from './Description';
import style from './inbody.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  remaining: number | null;
  trialAPIKey?: AIAPIKey;
  getTrialTurn: (featureId: AIFeature) => void;
}

type InbodyInfoTableField = {
  title: string | null;
  value: string | null;
  class: string | null;
  action: string | null;
};

type InbodyInfoTable = {
  title: keyof Inbody;
  field: Array<InbodyInfoTableField>;
};

export const InbodyTrial: FC<Props> = (props) => {
  const { remaining, trialAPIKey, getTrialTurn } = props;
  const { t } = useTranslation();
  const { showToast } = useToast();

  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [loadingExtractionResult, setLoadingExtractionResult] = useState<boolean>(false);
  const [showInbodyInfoTable, setShowInbodyInfoTable] = useState<boolean>(false);
  const [openRequirement, setOpenRequirement] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string>('');
  const [generalInfoTable, setGeneralInfoTable] = useState<Array<InbodyInfoTable>>([
    {
      title: 'Information',
      field: [],
    },
  ]);
  const [inbodyInfoTable, setInbodyInfoTable] = useState<Array<InbodyInfoTable>>([
    {
      title: 'Body Composition Analysis',
      field: [],
    },
    {
      title: 'Muscle-Fat Analysis',
      field: [],
    },
    {
      title: 'Obesity Analysis',
      field: [],
    },
    {
      title: 'InBody Score',
      field: [],
    },
    {
      title: 'Weight Control',
      field: [],
    },
  ]);

  const TABLE_HEADER = [t('fieldName'), t('value'), t('evaluate'), ''];

  const toggleRequirement = () => setOpenRequirement(!openRequirement);

  const resetAllState = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    setResultImage('');
    setShowInbodyInfoTable(false);
    setLoadingExtractionResult(false);
  };

  const convertResponseToResult = (responseNotice: AxiosResponse<AINoticeOCRInbody>) => {
    getTrialTurn(trialAPIKey?.ai_feature?.id as AIFeature);
    const resultNotice = responseNotice.data.result;
    if (!resultNotice.data || !resultNotice.image) {
      resetAllState();
      Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
      return;
    }
    if (responseNotice.data.result.error_code === InbodyStatusCode.SUCCESS) {
      const updatedInbodyInfoTable = generalInfoTable.concat(inbodyInfoTable).map((item) => {
        const fieldName = Object.keys(resultNotice.data[item.title]);
        return {
          ...item,
          field: Object.values(resultNotice.data[item.title]).map((v: any, index) => ({
            title: v.unit === 'string' || v.unit === 'int' ? fieldName[index] : `${fieldName[index]} (${v.unit})`,
            value: item.title === 'Body Composition Analysis' ? `${v.value} (${v.range})` : `${v.value}`,
            class: v.class !== null && v.class ? v.class : NOT_SET,
            action: '',
          })),
        };
      });
      const updatedGeneralInfoTable = updatedInbodyInfoTable.splice(0, 1);

      setShowInbodyInfoTable(updatedInbodyInfoTable.some((item) => item.field.length !== 0));
      setResultImage(resultNotice.image || '');
      setGeneralInfoTable(updatedGeneralInfoTable);
      setInbodyInfoTable(updatedInbodyInfoTable);
      setLoadingExtractionResult(false);
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

  const requestOCRInbodyTask = async (selectedFile: File) => {
    if (!tenantId || !trialAPIKey) return;
    setLoadingExtractionResult(true);
    try {
      const currentApiKey = trialAPIKey.id;
      const resOCRPrescription = await requestOCRInbody(tenantId, currentApiKey, '270');
      if (resOCRPrescription.data) {
        const formData = new FormData();
        const presignedUrl = resOCRPrescription.data.pre_signed_url;
        const presignedBody = resOCRPrescription.data.pre_signed_body;
        for (const key in presignedBody) {
          formData.append(key, presignedBody[key]);
        }
        formData.append('file', selectedFile);
        const resPresignedUrl = await uploadPresignedUrl(presignedUrl, formData);
        if (resPresignedUrl.status === HTTPStatusCode.NO_CONTENT) {
          const responseNotice = await noticeFromAI<AINoticeOCRInbody>(tenantId, resOCRPrescription.data.transaction_id, currentApiKey);
          convertResponseToResult(responseNotice);
        }
      }
    } catch (error) {
      resetAllState();
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
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
    await requestOCRInbodyTask(selectedFile);
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

  return (
    <div className={style.container}>
      <PopupLoading isOpen={loadingExtractionResult} title={t('extractingData')} content={t('doneSoon')} />
      {showInbodyInfoTable ? (
        <>
          <div className={style.turnBack} onClick={resetAllState}>
            <SVGIcon icon='ArrowLeft' className='mb-1' color={Palette.BLACK} size={16} />
            <p className='ml-1'>{t('btn.back')}</p>
          </div>
          <div className={style.resultContainer}>
            <SectionContainer title={t('uploadedImage')} className={style.imageContainer}>
              <Image src={resultImage} className={style.image} width='100%' />
            </SectionContainer>
            <div className={style.divider} />
            <SectionContainer title={t('extractionResult')} className={style.tableContainer}>
              <div className={style.tableInner}>
                <CTable responsive maxHeight={650}>
                  <thead>
                    <CTRow header data={TABLE_HEADER} />
                  </thead>
                  <tbody>
                    {generalInfoTable.map((item, index) =>
                      item.field.map((ele: any, idx) => (
                        <CTRow
                          key={index}
                          data={[t(ele.title), <p className={style.value}>{ele.value}</p>, <p className={style.value}>{ele.class}</p>, ele.action]}
                        />
                      ))
                    )}
                    {inbodyInfoTable.map((item) => (
                      <RowWithExpand
                        titleExpand={t(item.title)}
                        headerColumns={TABLE_HEADER.length}
                        children={
                          <>
                            {item.field.map((ele: any, idx) => (
                              <CTRow
                                key={idx}
                                data={[
                                  t(ele.title),
                                  <p className={style.value}>{ele.value}</p>,
                                  <p className={style.value}>{ele.class}</p>,
                                  ele.action,
                                ]}
                              />
                            ))}
                          </>
                        }
                      />
                    ))}
                  </tbody>
                </CTable>
              </div>
            </SectionContainer>
          </div>
        </>
      ) : (
        <>
          <InbodyDescription isOpen={openRequirement} toggle={toggleRequirement} />
          <hr className={style.line} />
          <SectionContainer title={t('uploadImage')}>
            <FileDragAndDrop className={style.dragDropImage} onFileDropped={(e) => changeImage(e.dataTransfer.files)}>
              <Image src={Upload} width={56} height={56} />
              <div className={style.fileContainer}>
                <p>{t('dragAndDropPhoto')}</p>
                <p>{t('or')}</p>
                <CButton className={style.textLabel} label={t('uploadImage')} onClick={openFileInput} />
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
        </>
      )}
    </div>
  );
};
