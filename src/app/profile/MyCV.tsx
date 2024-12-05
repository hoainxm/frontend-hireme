import { DeleteOutlined, DownloadOutlined, FilePdfOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Divider, List, message, Modal, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getResumeByUser, uploadCV } from './api';
import style from './MyCV.module.scss';
import { useAppDispatch } from '../../store/store';
import { getUserProfileThunk } from '../../store/reducer/userSlice/userThunk';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const MyCV = () => {
  const { t } = useTranslation();
  const fileInputRefCv = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [myListCV, setMyListCV] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    const res = await dispatch(getUserProfileThunk()).unwrap();
    if (res && res.data) {
      setMyListCV(res.data.myCV);
    }
  };

  const handleCvUploadClick = () => {
    setIsModalVisible(true);
  };

  const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      message.error('Vui lòng tải lên một file PDF.');
    }
  };

  const handleConfirmUploadCv = async () => {
    if (cvFile) {
      try {
        await uploadCV(cvFile);
        message.success('CV đã được tải lên thành công.');
        setCvFile(null);
        setIsModalVisible(false);
        const res = await dispatch(getUserProfileThunk()).unwrap();
        if (res && res.data) {
          setMyListCV(res.data.myCV);
        }
      } catch (error) {
        message.error('Không thể tải lên CV. Vui lòng thử lại.');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelUpload = () => {
    setCvFile(null);
    setIsModalVisible(false);
  };

  return (
    <div className={style['my-cv__container']}>
      <Card>
        <Title level={4}>{t('field.myCV')}</Title>
        <Button icon={<UploadOutlined />} onClick={handleCvUploadClick} type='primary' className={style['my-cv__upload-button']}>
          {t('btn.upload')}
        </Button>
        <Divider />
        <Title level={5}>{t('field.myCVList')}</Title>
        <List
          className={style['my-cv__list']}
          dataSource={myListCV}
          renderItem={(fileName) => (
            <List.Item
              actions={[
                <Button type='link' icon={<FileTextOutlined />} href={`${process.env.REACT_APP_API_URL}/images/resume/${fileName}`} target='_blank'>
                  {t('btn.viewDetails')}
                </Button>,
              ]}
            >
              <List.Item.Meta avatar={<FilePdfOutlined style={{ fontSize: '24px', color: '#1890ff' }} />} title={fileName} />
            </List.Item>
          )}
        />
      </Card>

      <Modal title={t('uploadCVLabel')} visible={isModalVisible} onCancel={handleCancelUpload} footer={null} centered>
        <div className={style['my-cv__modal-content']}>
          <input type='file' ref={fileInputRefCv} style={{ display: 'none' }} accept='application/pdf' onChange={handleCvFileChange} />
          <Button onClick={() => fileInputRefCv.current?.click()} icon={<UploadOutlined />} type='primary'>
            {t('uploadCVTitle')}
          </Button>
          {cvFile && <p className={style['my-cv__file-name']}>{cvFile.name}</p>}
          <div className={style['my-cv__upload-actions']}>
            <Button type='primary' onClick={handleConfirmUploadCv} disabled={!cvFile} className={style['my-cv__confirm-button']}>
              {t('btn.confirm')}
            </Button>
            <Button onClick={handleCancelUpload}>{t('btn.cancel')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyCV;
