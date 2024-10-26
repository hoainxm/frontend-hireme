import React, { useRef, useState } from 'react';
import CButton from '@base/button';
import { ButtonVariant, DocumentType, DynamicStatusCode, DynamicTemplateAction, HTTPStatusCode } from '@models/enum';
import { Form, Image } from 'react-bootstrap';
import ClearText from '@icon/ClearText.svg';
import { Trans, useTranslation } from 'react-i18next';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import Upload from '@images/Upload.svg';
import { CInput, CInputHint } from '@base/input';
import { SVGIcon } from '../../../../common/ui/assets/icon';
import { FORMAT_IMAGE_TYPE } from '../../../../common/utils/constants';
import style from './dynamicTemplate.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { noticeFromAI, requestCreateDynamicTemplate, uploadPresignedUrl } from '../../api';
import { Alert } from '../../../../common/utils/popup';
import { AINoticeDisplayDynamicImage } from '../../model';
import { PopupLoading } from '@base/loading/PopupLoading';
import { DynamicTemplateDescription } from './Description';

interface Props {
  trialAPIKey?: string;
  handleImageDynamicTemplateRes: (data: AINoticeDisplayDynamicImage) => void;
}

export const ImageTemplateForm = (props: Props) => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string>('');
  const { handleSubmit, register, getValues, setError, clearErrors, errors } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDescription, setIsOpenDescription] = useState<boolean>(false);

  const toggle = () => setIsOpenDescription((prev) => !prev);

  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const changeImage = async (files: FileList | null) => {
    if (!files || !files.length) return;
    //Check format file
    if (!FORMAT_IMAGE_TYPE.includes(files[0].type)) setError('image', { type: 'format' });
    else clearErrors('image');

    if (inputFileRef.current) inputFileRef.current.files = files;
    setImage(URL.createObjectURL(files[0]));
  };

  const convertResponseToResult = (data: AINoticeDisplayDynamicImage) => {
    if (!data.result) {
      Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
      return;
    }
    if (!data.error_code && data.result.error_code === DynamicStatusCode.SUCCESS) {
      data.result.data.document_type = getValues('type');
      props.handleImageDynamicTemplateRes(data);
    } else {
      setError('image', { type: 'quality' });
    }
  };

  const onValid: SubmitHandler<any> = async (data, event) => {
    if (!inputFileRef.current?.files?.[0]) {
      event?.target.classList.add('wasvalidated');
      setError('image', { type: 'required' });
      return;
    }
    if (!tenantId || !props.trialAPIKey) return;
    setIsLoading(true);
    try {
      const res = await requestCreateDynamicTemplate(tenantId, props.trialAPIKey, DynamicTemplateAction.DISPLAY, data.type);
      if (res.data) {
        const formData = new FormData();
        const presignedUrl = res.data.pre_signed_url;
        const presignedBody = res.data.pre_signed_body;
        for (const key in presignedBody) {
          formData.append(key, presignedBody[key]);
        }
        formData.append('file', inputFileRef.current.files[0]);
        const resImageUpload = await uploadPresignedUrl(presignedUrl, formData);
        if (resImageUpload.status === HTTPStatusCode.NO_CONTENT) {
          const responseNotice = await noticeFromAI<AINoticeDisplayDynamicImage>(tenantId, res.data.transaction_id, props.trialAPIKey);
          convertResponseToResult(responseNotice.data);
        }
      }
    } catch (error) {
      Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    } finally {
      setIsLoading(false);
    }
  };

  const openFileInput = () => {
    inputFileRef.current && inputFileRef.current.click();
  };

  const clearImageInput = () => {
    setImage('');
    clearErrors('image');
    if (inputFileRef.current?.value) inputFileRef.current.value = '';
  };

  return (
    <Form className={style.contentTemplateModal} onSubmit={handleSubmit(onValid)} id='process-image-template'>
      <PopupLoading isOpen={isLoading} title={t('extractingData')} content={t('doneSoon')} />
      <DynamicTemplateDescription isOpen={isOpenDescription} toggle={toggle} />
      <Form.Group className={style.selectType}>
        <div className={style.inputLabel}>{t('product.ocr.typeTemplateCreate')}</div>
        <form className='d-flex'>
          <Form.Check
            ref={register}
            custom
            defaultChecked={true}
            id='paper-choose'
            type='radio'
            value={DocumentType.PAPER}
            name='type'
            label={t('product.ocr.type.paper')}
          />
          <Form.Check
            ref={register}
            className='ml-5'
            custom
            id='lcd-choose'
            type='radio'
            value={DocumentType.LCD}
            name='type'
            label={t('product.ocr.type.lcd')}
          />
        </form>
      </Form.Group>
      <div>
        <div className={style.inputLabel}>{t('uploadImage')}</div>
        <FileDragAndDrop
          className={`${image && 'd-none'} ${errors.image && style.error} ${style.dragDropImage}`}
          onFileDropped={(e) => changeImage(e.dataTransfer.files)}
        >
          <Image src={Upload} width={56} height={56} />
          <div className={style.fileContainer}>
            <p>{t('dragAndDropPhoto')}</p>
            <p>{t('or')}</p>
            <CButton variant={ButtonVariant.OUTLINE} className={style.textLabel} onClick={openFileInput} type='button'>
              <div className='d-flex align-items-center'>
                <SVGIcon className='ml-0' icon='Image' size={16} />
                <p className='ml-2'>{t('uploadImage')}</p>
              </div>
            </CButton>
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
        {image && (
          <div className={`${style.imagePreview} ${errors?.image?.type && style.error}`}>
            <Image src={image} />
            <p>{inputFileRef.current?.files?.[0]?.name}</p>
            <Image src={ClearText} width={16} onClick={clearImageInput} />
          </div>
        )}
        {errors?.image?.type === 'quality' && (
          <CInputHint className='validated'>
            <Trans i18nKey='error.imageQuality' components={{ span: <span className={style.linkDescription} onClick={toggle} /> }} />
          </CInputHint>
        )}
        {errors?.image?.type === 'format' && <CInputHint className='validated'>{t('error.imageFormat')}</CInputHint>}
        {errors?.image?.type === 'required' && <CInputHint className='validated'>{t('error.imageRequired')}</CInputHint>}
      </div>
    </Form>
  );
};
