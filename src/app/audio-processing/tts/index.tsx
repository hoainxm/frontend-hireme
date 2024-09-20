import React, { FC, useRef, useState } from 'react';
import { RemainRequestCard } from '@base/card';
import { TrialContentLayout } from '@layout/trial-content-layout';
import style from './tts.module.scss';
import { useTranslation } from 'react-i18next';
import { useGetRemainTurn } from '@hooks/useGetRemainTurn';
import { Form, Image } from 'react-bootstrap';
import CButton from '@base/button';
import { RootState } from '@models/rootReducer';
import { useSelector } from 'react-redux';
import { noticeFromAI, requestTTS } from '../api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Confirm } from '../../../common/utils/popup';
import { AINoticeTTS } from 'app/trial/model';
import { ButtonVariant, HTTPStatusCode } from '@models/enum';
import { PopupLoading } from '@base/loading/PopupLoading';
import { CInput, CInputHint } from '@base/input';
import { SVGIcon } from '@icon/index';
import { CSSelect } from '@base/select';
import CAudio from '@base/audio';
import { FileDragAndDrop } from '@base/input/FileDragAndDrop';
import Upload from '@images/Upload.svg';
import ClearText from '@icon/ClearText.svg';
import Txt from '@icon/Txt.svg';
import FileText from '@icon/FileText.svg';
import Docx from '@icon/Docx.svg';

interface Props {}

export const TextToSpeech: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { remaining, trialAPIKey, getTrialTurn } = useGetRemainTurn();
  const [audio, setAudio] = useState<string>();
  const tenantId = useSelector((state: RootState) => state.main.userInfo?.tenant);
  const { register, handleSubmit, errors, watch, setError, reset, clearErrors, getValues, setValue, control } = useForm<{ text: string; file: FileList }>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUseTextFile, setIsUseTextFile] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapperInputRef = useRef<HTMLDivElement>(null);

  const changeImage = async (files: FileList | null) => {
    if (!files || !files[0]?.name) return;
    //Check format file
    const suffix = files[0].name.split('.').pop() || '';
    if (!['txt', 'docx'].includes(suffix)) setError('file', { type: 'type' });
    else if (files[0].size > 2097152) setError('file', { type: 'size' });
    else clearErrors('file');

    setValue('file', files);
    setImage(URL.createObjectURL(files[0]));
  };

  const openFileInput = () => {
    const input = wrapperInputRef.current?.querySelector("input[type='file'") as HTMLInputElement;
    input && input.click();
  };

  const clearImageInput = () => {
    setImage('');
    clearErrors('file');
    setValue('file', undefined);
  };

  const submitText: SubmitHandler<{ text: string; file: FileList }> = async (data) => {
    if (!tenantId || !trialAPIKey?.id || Object.keys(errors).length) return;
    if (remaining !== null && remaining === 0) {
      Confirm.danger({
        title: t('cfm.freeTrialOver.title'),
        content: t('cfm.freeTrialOver.content'),
        labelBtnCancel: t('btn.understood'),
        labelBtnCfm: t('btn.contactNow'),
      });
      return;
    }
    try {
      setIsLoading(true);
      const form = new FormData();
      if (isUseTextFile && data.file?.[0]) form.append('file', data.file?.[0]);
      else form.append('text', data.text);
      const resTTS = await requestTTS(tenantId, trialAPIKey.id, form);

      if (resTTS.data && audioRef.current) {
        const resNotion = await noticeFromAI<AINoticeTTS>(tenantId, resTTS.data.transaction_id, trialAPIKey.id);

        if (resNotion.data.error_code === HTTPStatusCode.SUCCESS && resNotion.data.result.data.wav) {
          setAudio(`data:audio/mpeg;base64,${resNotion.data.result.data.wav}`);
          audioRef.current.load();
          trialAPIKey.ai_feature && getTrialTurn(trialAPIKey.ai_feature.id);
        } else if (!resNotion.data.result) {
          Alert.error({ title: 'Oops!', content: t('error.aiCoreIsBusy') });
        } else
          Confirm.danger({
            title: t('cfm.extractFail.title'),
            content: t('cfm.extractFail.content'),
            labelBtnCfm: t('btn.understood'),
            labelBtnCancel: t('btn.reviewRequirement'),
          });
      }
    } catch (error: any) {
      const message: string = error.response?.data?.file?.[0] || error.response?.data?.text?.[0] ||'';
      const MAP_MESSAGE_ERROR: Record<string, string> = {
        'Ensure this file has no more than 500 characters.': 'maximumChar',
        'Ensure this file has no contain image.': 'insertImage',
        'Ensure this text has no contain emoji.': 'fileEmoji',
      };

      if (MAP_MESSAGE_ERROR?.[message]) setError('file', { type: MAP_MESSAGE_ERROR[message] });
      else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
    } finally {
      setIsLoading(false);
    }
  };

  const getIconFile = (filename: string) => {
    if (/^.*\.txt$/.test(filename)) return Txt;
    else if (/^.*\.docx$/.test(filename)) return Docx;
    else return FileText;
  };

  const handleChangeInputType =(isTextFileInput: boolean) => {
    clearErrors();
    setImage('');
    reset();
    setIsUseTextFile(isTextFileInput)
    setAudio(undefined);
  }

  return (
    <TrialContentLayout
      title={t('product.speechProcessing.textToSpeech')}
      btnGroup={<RemainRequestCard className={style.btnRemainTurnWrapper} count={remaining} />}
    >
      <PopupLoading isOpen={isLoading} title={t('processingData')} content={t('doneSoon')} />
      <Form className={style.formTTS} onSubmit={handleSubmit(submitText)}>
        <div className={style.groupTTS}>
          <h6 className={style.titleTTS}>{t('inputText')}</h6>
          <ul className={style.TagsTTS}>
            <li className={!isUseTextFile && style.activeTag} onClick={() => handleChangeInputType(false)}>
              <SVGIcon className={style.tagIcon} icon='Text' size={16} />
              <p>{t('enterText')}</p>
            </li>
            <li className={isUseTextFile && style.activeTag} onClick={() => handleChangeInputType(true)}>
              <SVGIcon className={style.tagIcon} icon='File' size={16} />
              <p>{t('uploadFile')}</p>
            </li>
          </ul>
          <Form.Group className={style.formGroup}>
            <Form.Label className={style.labelTTS}>{t('text')}</Form.Label>
            <div className={style.textareaHead}>
              <p>{t('cautionEmojiIcon')}</p>
              {!isUseTextFile && <p className={style.chartCounter}>{watch('text')?.length || 0}/500</p>}
            </div>
            {isUseTextFile ? (
              <>
                <FileDragAndDrop
                  className={`${image && 'd-none'} ${errors.file && style.error} ${style.dragDropImage}`}
                  onFileDropped={(e) => changeImage(e.dataTransfer.files)}
                >
                  <Image src={Upload} width={56} height={56} />
                  <div className={style.fileContainer}>
                    <p>{t('dragAndDropDocxTxtFile')}</p>
                    <p>{t('or')}</p>
                    <CButton variant={ButtonVariant.OUTLINE} className={style.textLabel} onClick={openFileInput} type='button'>
                      <div className='d-flex align-items-center'>
                        <SVGIcon className='ml-0' icon='Image' size={16} />
                        <p className='ml-2'>{t('uploadFile')}</p>
                      </div>
                    </CButton>
                  </div>
                  <div className={style.note}>
                    {t('note')}: {t('uploadFile.tts.maxSize')}
                  </div>
                  <div ref={wrapperInputRef}>
                    <CInput
                      iref={register({ required: true })}
                      id='inbody-upload-image'
                      type='file'
                      name='file'
                      className='d-none'
                      accept='.docx, .txt'
                      onChange={(e) => changeImage(e.currentTarget.files)}
                    />
                  </div>
                </FileDragAndDrop>
                {image && (
                  <div className={`${style.imagePreview} ${errors?.file?.type && style.error}`}>
                    <Image src={getIconFile(getValues('file')?.[0].name || '')} />
                    <p>{getValues('file')?.[0]?.name}</p>
                    <Image src={ClearText} width={16} onClick={clearImageInput} />
                  </div>
                )}
                {errors?.file?.type === 'required' && <CInputHint className='validated'>{t('error.fileRequired')}</CInputHint>}
                {errors?.file?.type === 'size' && <CInputHint className='validated'>{t('error.fileSize')}</CInputHint>}
                {errors?.file?.type === 'type' && <CInputHint className='validated'>{t('error.fileType')}</CInputHint>}
                {errors?.file?.type === 'maximumChar' && <CInputHint className='validated'>{t('error.fileMaximumChar')}</CInputHint>}
                {errors?.file?.type === 'fileEmoji' && <CInputHint className='validated'>{t('error.fileEmoji')}</CInputHint>}
                {errors?.file?.type === 'insertImage' && <CInputHint className='validated'>{t('error.insertImage')}</CInputHint>}
              </>
            ) : (
              <>
                <Form.Control
                  as='textarea'
                  className={`${errors.text && style.invalid}`}
                  name='text'
                  ref={register({ required: true })}
                  rows={9}
                  placeholder={t('error.textNonIconRequired')}
                  maxLength={500}
                />
                {errors.text && <CInputHint className='validated'>{t('error.textRequired')}</CInputHint>}
              </>
            )}
          </Form.Group>
        </div>
        <div className={style.groupTTS}>
          <h6 className={style.titleTTS}>{t('audioSetting')}</h6>
          <Form.Group className={style.formGroup}>
            <Form.Label className={style.labelTTS}>{t('voice')}</Form.Label>
            <CSSelect name='readingVoice' iref={register({})} className={style.voiceTTS} defaultValue={'male'} canUncheck={false}>
              <option title={t('male')} value={'male'}>
                {t('male')}
              </option>
              {/* <option title={t('female')} value={'female'}>
                {t('female')}
              </option> */}
            </CSSelect>
          </Form.Group>
        </div>
        <div className={style.wrapTTSBtn}>
          <CButton type='submit' className={style.convertTTSBtn}>{t('btn.tts')}</CButton>
        </div>
        <div className={`${!audio && 'd-none'} ${style.groupTTS}`}>
          <h6 className={style.titleTTS}>{t('convertResult')}</h6>
          <CAudio audio={audio} audioRef={audioRef} />
        </div>
      </Form>
    </TrialContentLayout>
  );
};
