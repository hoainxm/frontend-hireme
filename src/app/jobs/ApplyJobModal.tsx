import { UploadOutlined, FilePdfOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Typography, Radio, Input, Collapse, Upload, Divider, message } from 'antd';
import React, { FC, useState, HTMLAttributes, useEffect } from 'react';
import style from './ApplyJobModal.module.scss';
import { applyFile, createResume } from './api';
import { useTranslation } from 'react-i18next';
import { useCVContext } from './components/CVContext';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Dragger } = Upload;

interface Props extends HTMLAttributes<HTMLDivElement> {
  jobName: string;
  companyId: string;
  jobId: string;
  disabled?: boolean;
  onClose: () => void;
}

const ApplyJobModal: FC<Props> = ({ jobName, onClose, companyId, jobId }) => {
  const { t } = useTranslation();
  const { myListCV } = useCVContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedLibraryCV, setSelectedLibraryCV] = useState('');
  const [cvSource, setCvSource] = useState<string>('library');
  const [urlCV, setUrlCV] = useState<string>('');

  const handleFileChange = async (file: File) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      setSelectedLibraryCV('');
      const res = await applyFile(file);
      if (res && res.data) {
        setUrlCV(res.data.fileName);
      }
      return false;
    } else {
      message.error(t('fileSupportHint'));
      return false;
    }
  };

  const handleLibraryCVChange = (e: any) => {
    setSelectedLibraryCV(e.target.value);
    setSelectedFile(null);
    setUrlCV(e.target.value);
  };

  const handleApplyClick = async () => {
    if (selectedFile || selectedLibraryCV) {
      setLoading(true);
      try {
        const dataSubmit = selectedLibraryCV ? { url: selectedLibraryCV, companyId, jobId } : { url: urlCV, companyId, jobId };

        const result = await createResume(dataSubmit);
        if (result && result.data) {
          message.success(t('submitApplicationSuccess', { jobName }));
          setSelectedFile(null);
          setSelectedLibraryCV('');
          setCoverLetter('');
          onClose();
        }
      } catch (error) {
        message.error(t('submitApplicationFailure'));
      } finally {
        setLoading(false);
      }
    } else {
      message.warning(t('pleaseSelectFileOrCV'));
    }
  };

  useEffect(() => {
    if (selectedFile && cvSource !== 'upload') {
      setCvSource('upload');
    }
  }, [selectedFile, cvSource]);

  return (
    <Modal
      title={
        <Title level={4} className={style['apply-job-modal__title']}>
          {t('applyForPosition')} {jobName}
        </Title>
      }
      visible={true}
      onCancel={onClose}
      footer={null}
      centered
      width={920}
    >
      <div className={style['apply-job-modal__content']}>
        <Radio.Group onChange={(e) => setCvSource(e.target.value)} value={cvSource} style={{ width: '100%' }}>
          <Collapse defaultActiveKey={cvSource === 'library' ? ['1'] : ['2']} accordion bordered={false}>
            <Panel
              header={
                <div onClick={() => setCvSource('library')}>
                  <Text strong>{t('chooseCVFromLibrary')}</Text>
                </div>
              }
              key='1'
              extra={<Radio value='library' />}
              className={cvSource === 'library' ? '' : style['apply-job-modal__disabled']}
            >
              <Radio.Group
                onChange={handleLibraryCVChange}
                value={selectedLibraryCV}
                disabled={cvSource !== 'library'}
                className={style['apply-job-modal__radio-group']}
              >
                {myListCV.length > 0 ? (
                  myListCV.map((cv, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Radio value={cv}>{cv}</Radio>
                      <Button type='link' icon={<FileTextOutlined />} href={`${process.env.REACT_APP_API_URL}/images/resume/${cv}`} target='_blank'>
                        {t('btn.viewDetails')}
                      </Button>
                    </div>
                  ))
                ) : (
                  <Text type='secondary'>{t('noCVAvailable')}</Text>
                )}
              </Radio.Group>
            </Panel>

            <Panel
              header={
                <div onClick={() => setCvSource('upload')}>
                  <Text strong>{t('uploadCVFromComputer')}</Text>
                </div>
              }
              key='2'
              extra={<Radio value='upload' />}
              className={cvSource === 'upload' ? '' : style['apply-job-modal__disabled']}
            >
              <Dragger
                beforeUpload={handleFileChange}
                maxCount={1}
                accept='.pdf,.doc,.docx'
                disabled={cvSource !== 'upload'}
                className={style['apply-job-modal__upload-dragger']}
              >
                {selectedFile ? (
                  <div className={style['apply-job-modal__file-preview']}>
                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                    <Text strong>{selectedFile.name}</Text>
                    <CloseOutlined onClick={() => setSelectedFile(null)} className={style['apply-job-modal__remove-icon']} />
                  </div>
                ) : (
                  <>
                    <p>{t('dragOrClickToUpload')}</p>
                    <p>{t('fileSupportHint')}</p>
                  </>
                )}
              </Dragger>
            </Panel>
          </Collapse>
        </Radio.Group>
        <Divider />

        <div className={style['apply-job-modal__actions']}>
          <Button onClick={onClose} className={style['apply-job-modal__cancel-button']}>
            {t('cancel')}
          </Button>
          <Button
            type='primary'
            onClick={handleApplyClick}
            loading={loading}
            disabled={!(selectedFile || selectedLibraryCV)}
            className={style['apply-job-modal__submit-button']}
          >
            {t('submitApplication')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyJobModal;
