import { UploadOutlined, FilePdfOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Typography, Radio, Input, Collapse, Upload, Divider, message } from 'antd';
import React, { FC, useRef, useState, HTMLAttributes } from 'react';
import style from './ApplyJobModal.module.scss';
import { applyFile, createResume } from './api';
import { useTranslation } from 'react-i18next';

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
      message.error('File must be under 5MB.');
      return false;
    }
  };

  const handleLibraryCVChange = (e: any) => {
    setSelectedLibraryCV(e.target.value);
    setSelectedFile(null);
  };

  const handleApplyClick = async () => {
    if (selectedFile || selectedLibraryCV) {
      setLoading(true);
      try {
        const dataSubmit = { url: urlCV, companyId, jobId };
        const result = await createResume(dataSubmit);
        if (result && result.data) {
          message.success(`Successfully applied for the job ${jobName}`);
          setSelectedFile(null);
          setSelectedLibraryCV('');
          setCoverLetter('');
          onClose();
        }
      } catch (error) {
        message.error('Application failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      message.warning('Please select a file or a CV from the library.');
    }
  };

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
                  <Text strong>Choose CV from Library 📂</Text>
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
                <Radio value='libraryCV1.pdf'>CV 1 - Software Engineer</Radio>
                <Radio value='libraryCV2.pdf'>CV 2 - Project Manager</Radio>
                <Radio value='libraryCV3.pdf'>CV 3 - Frontend Developer</Radio>
              </Radio.Group>
            </Panel>

            <Panel
              header={
                <div onClick={() => setCvSource('upload')}>
                  <Text strong>Upload CV from Computer 💻</Text>
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
                    <p className='ant-upload-drag-icon'>
                      <UploadOutlined />
                    </p>
                    <p className='ant-upload-text'>Drag or click to upload</p>
                    <p className='ant-upload-hint'>Supports .doc, .docx, .pdf files under 5MB</p>
                  </>
                )}
              </Dragger>
            </Panel>
          </Collapse>
        </Radio.Group>

        <Divider />

        <div className={style['apply-job-modal__cover-letter-section']}>
          <Title level={5} className={style['apply-job-modal__cover-letter-title']}>
            Cover Letter
          </Title>
          <TextArea
            rows={4}
            placeholder='Write a brief cover letter...'
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className={style['apply-job-modal__cover-letter']}
          />
        </div>

        <div className={style['apply-job-modal__actions']}>
          <Button onClick={onClose} className={style['apply-job-modal__cancel-button']}>
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={handleApplyClick}
            loading={loading}
            disabled={!(selectedFile || selectedLibraryCV)}
            className={style['apply-job-modal__submit-button']}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyJobModal;
