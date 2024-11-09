import React, { FC, useState, HTMLAttributes, ChangeEvent } from 'react';
import style from './applyButton.module.scss';
import { Form } from 'react-bootstrap';
import { CCollapse, CPanel } from '@base/collapse';
import { useTranslation } from 'react-i18next';

interface Props extends HTMLAttributes<HTMLDivElement> {
  jobname: string;
  disabled?: boolean;
}

export const ApplyButton: FC<Props> = ({ jobname }) => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [cvOption, setCvOption] = useState<string>('account');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const removeUploadedFile = () => setUploadedFile(null);

  const handleSubmit = () => {
    console.log('CV submitted');
    setIsSubmitted(true);
    setShowPopup(false);
  };

  return (
    <>
      <button className={style.applyButton} onClick={togglePopup}>
        {t('jobDetail.applyNow')}
      </button>

      {showPopup && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h4>{`${t('applyJobTitle')} ${' '} ${jobname}`}</h4>
              <button className={style.closeButton} onClick={togglePopup}>
                &times;
              </button>
            </div>
            <div className={style.modalContent}>
              <CCollapse isAccordion={true} defaultActiveKey={[0]}>
                <CPanel header={t('chooseFromLibrary')}>
                  <div className={style.inputContainer}>
                    <label htmlFor='cvLink' className={style.label}>
                      {t('cvLinkLabel')}
                    </label>
                    <Form.Control
                      type='text'
                      id='cvLink'
                      placeholder='https://www.topcv.vn/...'
                      className={style.textField}
                      title={t('cvLinkTitle')}
                    />
                  </div>
                </CPanel>

                <CPanel header={t('uploadFromComputer')}>
                  <div className={style.inputContainer}>
                    <label htmlFor='cvFile' className={style.label}>
                      {t('uploadCVLabel')}
                    </label>
                    <Form.Control
                      type='file'
                      id='cvFile'
                      className={style.fileInput}
                      accept='.doc, .docx, .pdf'
                      title={t('uploadCVTitle')}
                      onChange={handleFileUpload}
                    />
                    {uploadedFile && (
                      <div className={style.uploadedFileInfo}>
                        <span>{uploadedFile.name}</span>
                        <button className={style.removeFileButton} onClick={removeUploadedFile}>
                          {t('removeFile')}
                        </button>
                      </div>
                    )}
                  </div>
                </CPanel>
              </CCollapse>

              <div className={style.textAreaContainer}>
                <label htmlFor='coverLetter' className={style.label}>
                  {t('coverLetterLabel')}
                </label>
                <Form.Control
                  as='textarea'
                  id='coverLetter'
                  placeholder={t('coverLetterPlaceholder')}
                  rows={4}
                  className={style.textArea}
                  title={t('coverLetterTitle')}
                />
              </div>

              <div className={style.submitContainer}>
                <button className={style.submitButton} onClick={handleSubmit}>
                  {t('submitApplication')}
                </button>
                <button className={style.cancelButton} onClick={togglePopup}>
                  {t('cancel')}
                </button>
                {isSubmitted && <p className={style.successMessage}>{t('applicationSubmitted')}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyButton;
