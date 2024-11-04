import CButton from '@base/button';
import { CTRow } from '@base/index';
import { CInput } from '@base/input';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import { PopupLoading } from '@base/loading/PopupLoading';
import { CSSelect } from '@base/select';
import CTable from '@base/table';
import { TruncatedTextTooltip } from '@base/tool-tip/TruncatedTextTooltip';
import { useToast } from '@hooks/useToast';
import Upload from '@images/Upload.svg';
import { AIFeature, HTTPStatusCode, Palette, PrescriptionLanguage, PrescriptionStatusCode, ToastPosition, ToastType } from '@models/enum';
import { RootState } from 'store/rootReducer';
import { AxiosResponse } from 'axios';
import React, { FC, HTMLAttributes, useRef, useState } from 'react';
import { Form, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { cleanNullableValueInObject, dataUrlToFile } from '../../../../common/utils/common';
import { FORMAT_IMAGE_TYPE, NOT_SET } from '../../../../common/utils/constants';
import { Alert, Confirm } from '../../../../common/utils/popup';
import { AIAPIKey } from '../../../dashboard/model';
import { noticeFromAI, requestOCRPrescription, uploadPresignedUrl } from '../../api';
import { AINoticeOCRPrescription, Medicine, Prescription } from '../../model';
import { RowWithExpand } from '../../shared/RowWithExpand';
import { SectionContainer } from '../../shared/SectionContainer';
import { PrescriptionDescription } from './Description';
import { DOSAGE_LANGUAGE_MAPPING, INITIAL_BODY_FIELDS } from './constant';
import style from './prescription.module.scss';
import { WebcamModal } from '../../shared/WebcamModal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  remaining: number | null;
  trialAPIKey?: AIAPIKey;
  getTrialTurn: (featureId: AIFeature) => void;
}

export const PrescriptionTrial: FC<Props> = (props) => {
  const { remaining, trialAPIKey, getTrialTurn } = props;
  const { t } = useTranslation();
  const { showToast } = useToast();

  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const durationUnitRef = useRef<string>('');
  const initialPrescriptionLanguage = [
    { title: 'language.vie', value: PrescriptionLanguage.VIETNAMESE },
    { title: 'language.eng', value: PrescriptionLanguage.ENGLISH },
  ];

  const [loadingExtractionResult, setLoadingExtractionResult] = useState<boolean>(false);
  const [openRequirement, setOpenRequirement] = useState<boolean>(false);
  const [openWebcam, setOpenWebcam] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string>('');
  const [medicineName, setMedicineName] = useState<Array<string>>([]);
  const [medicineInfoTable, setMedicineInfoTable] = useState<Array<Record<string, any>>>([]);
  const [createdDateTable, setCreatedDateTable] = useState<Array<string>>([]);
  const [scheduleTable, setScheduleTable] = useState<Array<Record<number, string>>>([]);
  const [prescriptionLanguage, setPrescriptionLanguage] = useState<string>(PrescriptionLanguage.VIETNAMESE);
  const linkMedicines = useRef<Array<string>>([]);

  const toggleRequirement = () => setOpenRequirement(!openRequirement);
  const toggleWebcam = () => setOpenWebcam(!openWebcam);

  const resetAllState = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    durationUnitRef.current = '';
    setLoadingExtractionResult(false);
    setResultImage('');
    setMedicineName([]);
    setMedicineInfoTable([]);
    setCreatedDateTable([]);
    setScheduleTable([]);
    setOpenWebcam(false);
  };

  const changePrescriptionLanguage = (language: string) => {
    setPrescriptionLanguage(language);
  };

  const formattingMedicines = (medicines: Array<Medicine>) => {
    const formattedMedicines: Array<Record<string, any>> = [];

    for (const fieldName of INITIAL_BODY_FIELDS) {
      const formattedMedicine: Record<string, any> = {};
      for (const medicine of medicines) {
        if (typeof medicine[fieldName] === 'object') {
          if (!(fieldName === 'strength' || fieldName === 'duration')) {
            if (fieldName === 'dosage') {
              formattedMedicine[medicine.medicine_name] = medicine[fieldName];
            } else {
              formattedMedicine[medicine.medicine_name] = medicine[fieldName]?.value || NOT_SET;
            }
          }

          // if (fieldName === 'dosage') {
          //   formattedMedicine[medicine.medicine_name] = medicine[fieldName];
          // } else if (fieldName === 'duration') {
          //   durationUnitRef.current = durationUnitRef.current.length !== 0 ? durationUnitRef.current : medicine[fieldName]?.unit || '';
          //   formattedMedicine[medicine.medicine_name] = medicine[fieldName]?.value || NOT_SET;
          // } else {
          //   formattedMedicine[medicine.medicine_name] = medicine[fieldName]?.value || NOT_SET;
          // }
        } else {
          formattedMedicine[medicine.medicine_name] = medicine[fieldName] || NOT_SET;
        }
      }
      formattedMedicines.push(formattedMedicine);
    }

    return formattedMedicines;
  };

  const formattingSchedule = (headers: Array<string>, prescription: Prescription) => {
    const schedule: Array<Record<number, string>> = [];
    const followUpSchedule = prescription.follow_up_schedule;

    for (const key in followUpSchedule) {
      const obj: Record<number, string> = {};
      obj[0] = key;
      obj[1] = followUpSchedule[key] || NOT_SET;
      for (let i = 2; i < headers.length; i++) {
        obj[i] = '';
      }
      schedule.push(obj);
    }

    return schedule;
  };

  const convertResponseToResult = (responseNotice: AxiosResponse<AINoticeOCRPrescription>) => {
    getTrialTurn(trialAPIKey?.ai_feature?.id as AIFeature);

    const resultNotice = responseNotice.data.result;
    if (!resultNotice) {
      resetAllState();
      Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
      return;
    }
    if (resultNotice.error_code === PrescriptionStatusCode.SUCCESS) {
      const data = resultNotice.data.result;
      const medicines = data.medicine;
      linkMedicines.current = medicines.map((item) => item?.medicine_link || '');
      const medicineNames = medicines.map((item) => item.medicine_name || NOT_SET);
      const headers = [t('fieldName'), ...medicineNames.map((_, index) => t('medicine', { value: index + 1 })), ''];
      const schedule = formattingSchedule(headers, data);
      const formattedMedicines = formattingMedicines(medicines);

      setLoadingExtractionResult(false);
      setResultImage(resultNotice.data.image || '');
      setMedicineName(medicineNames);
      setMedicineInfoTable(formattedMedicines);
      setCreatedDateTable(['date', data.date_create || NOT_SET]);
      setScheduleTable(schedule);
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

  const requestOCRPrescriptionTask = async (selectedFile: File) => {
    if (!tenantId || !trialAPIKey) return;
    setLoadingExtractionResult(true);
    try {
      const currentApiKey = trialAPIKey.id;
      const resOCRPrescription = await requestOCRPrescription(tenantId, currentApiKey, prescriptionLanguage);
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
          const responseNotice = await noticeFromAI<AINoticeOCRPrescription>(tenantId, resOCRPrescription.data.transaction_id, currentApiKey);
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
      return Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
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
    } else {
      await requestOCRPrescriptionTask(selectedFile);
    }
  };

  const detectWebcamImage = async (imgSrc: string) => {
    const fileImageWebcam = await dataUrlToFile(imgSrc, 'webcam-image');
    setOpenWebcam(false);
    await requestOCRPrescriptionTask(fileImageWebcam);
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
      inputFileRef.current && inputFileRef.current.click();
    }
  };

  const tableHeader = [t('fieldName'), ...medicineName.map((_, index) => t('medicine', { value: index + 1 })), ''];

  return (
    <div className={style.container}>
      <PopupLoading isOpen={loadingExtractionResult} title={t('extractingData')} content={t('doneSoon')} />
      {medicineInfoTable.length > 0 ? (
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
                    <CTRow header data={tableHeader} />
                  </thead>
                  <tbody>
                    <RowWithExpand
                      titleExpand={t('medicineInformation')}
                      headerColumns={tableHeader.length}
                      children={
                        <>
                          {medicineInfoTable.map((tb, index) => {
                            const formattedInitialFields =
                              INITIAL_BODY_FIELDS[index] === 'duration'
                                ? t(INITIAL_BODY_FIELDS[index], {
                                    value: durationUnitRef.current.length !== 0 ? `(${t(durationUnitRef.current)})` : '',
                                  })
                                : t(INITIAL_BODY_FIELDS[index]);
                            return (
                              <CTRow
                                key={index}
                                data={[
                                  formattedInitialFields,
                                  ...medicineName.map((item, idx) => {
                                    if (typeof tb[item] === 'object') {
                                      const dosage = Object.entries(cleanNullableValueInObject(tb[item]))
                                        .map(([key, value]) => {
                                          if (key === 'other') return value;
                                          return `${value} ${
                                            prescriptionLanguage === PrescriptionLanguage.VIETNAMESE ? DOSAGE_LANGUAGE_MAPPING[key] : key
                                          }`;
                                        })
                                        .join(', ');

                                      return (
                                        <TruncatedTextTooltip placement='bottom' tooltipContent={dosage} className={style.value}>
                                          {dosage}
                                        </TruncatedTextTooltip>
                                      );
                                    }
                                    return (
                                      <TruncatedTextTooltip placement='bottom' tooltipContent={tb[item]} className={style.value}>
                                        {index === 0 && linkMedicines.current[idx] ? (
                                          <a href={linkMedicines.current[idx]} target='_blank' rel='noreferrer'>
                                            {tb[item]}
                                          </a>
                                        ) : (
                                          tb[item]
                                        )}
                                      </TruncatedTextTooltip>
                                    );
                                  }),
                                  '',
                                ]}
                              />
                            );
                          })}
                        </>
                      }
                    />
                    {/* <RowWithExpand
                      titleExpand={t('prescriptionCreatedDate')}
                      headerColumns={tableHeader.length}
                      children={
                        <CTRow
                          data={[
                            ...createdDateTable.map((item, index) => (index === 0 ? t(item) : item)),
                            ...tableHeader.slice(createdDateTable.length).map(() => ''),
                          ]}
                        />
                      }
                    />
                    <RowWithExpand
                      titleExpand={t('followUpSchedule')}
                      headerColumns={tableHeader.length}
                      children={
                        <>
                          {scheduleTable.map((item, index) => (
                            <CTRow key={index} data={Object.entries(item).map(([key, value]) => (Number(key) === 0 ? t(value) : value))} />
                          ))}
                        </>
                      }
                    /> */}
                  </tbody>
                </CTable>
              </div>
            </SectionContainer>
          </div>
        </>
      ) : (
        <>
          <PrescriptionDescription isOpen={openRequirement} toggle={toggleRequirement} />
          <hr className={style.line} />
          <div className='mb-4 d-inline-block'>
            <div className={style.language}>
              <Form.Label className='mr-3 mb-0 required'>{t('language.prescription')}</Form.Label>
              <CSSelect
                className={style.languageSelection}
                name='prescription'
                defaultValue={prescriptionLanguage}
                canUncheck={false}
                onChangeSelect={(data) => changePrescriptionLanguage(data.value)}
              >
                {initialPrescriptionLanguage.map((language, index) => (
                  <option key={index} title={t(language.title)} value={language.value}>
                    {t(language.title)}
                  </option>
                ))}
              </CSSelect>
            </div>
          </div>
          <SectionContainer title={t('uploadImage')}>
            <div className={style.uploadImageContainer}>
              <WebcamModal isOpen={openWebcam} toggle={toggleWebcam} detectWebcamImage={detectWebcamImage} />
              <FileDragAndDrop className={style.dragDropImage} onFileDropped={(e) => handleChangeImage(e.dataTransfer.files)}>
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
                    <CButton type='button' className={`${style.textLabel} ml-2`} onClick={toggleWebcam}>
                      <div className='d-flex align-items-center'>
                        <SVGIcon className='ml-0' icon='Camera' size={16} />
                        <p className='ml-2'>{t('btn.openWebcam')}</p>
                      </div>
                    </CButton>
                  </div>
                </div>
                <div className={style.note}>
                  {t('note')}: {t('uploadImage.prescription.note')}
                </div>
                <div className={style.note}>{t('uploadImage.secondNote')}</div>
                <CInput
                  iref={inputFileRef}
                  id='prescription-upload-image'
                  type='file'
                  name='file'
                  className='d-none'
                  accept='.png, .jpg, .jpeg'
                  onChange={(e) => handleChangeImage(e.currentTarget.files)}
                />
              </FileDragAndDrop>
            </div>
          </SectionContainer>
        </>
      )}
    </div>
  );
};
