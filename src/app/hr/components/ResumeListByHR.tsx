/** @format */

import React, { FC, useState, useEffect } from 'react';
import { fetchResumesByHR, updateResumeStatus } from '../api';
import { Resume } from '../model';
import { Image } from 'react-bootstrap';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../common/ui/base';
import { Alert, Confirm } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ResumeStatus, ResumeStatusMapping, ResumeStatusOptions } from '../model';
import { Modal, Form, Select, Button } from 'antd';
import Edit from '../../../common/ui/assets/icon/Edit.svg';
import ResumeTable from './ResumeTable';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

interface Props {
  id: string;
}

const ResumeListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.email'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.status'),
    t('field.submissionTime'),
    t('field.action'),
  ];

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchResumesByHR(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setResumes(result);
        setCurrentPage(meta.current);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleEditClick = (resume: Resume) => {
    setSelectedResume(resume);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setSelectedResume(null);
    setIsModalVisible(false);
  };

  const handleModalSubmit = async (values: { status: ResumeStatus }) => {
    if (selectedResume) {
      try {
        await updateResumeStatus(selectedResume._id, values.status);
        Alert.success({ title: t('success.title'), content: t('success.updateResume') });
        setIsModalVisible(false);
        fetchData(currentPage);
      } catch {
        Alert.error({ title: t('error.title'), content: t('error.updateResume') });
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, pageSize]);

  return (
    <div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {resumes.length > 0 ? (
            resumes.map((resume, index) => (
              <CTRow
                key={resume._id}
                data={[
                  index + 1,
                  resume.email || t('field.notSet'),
                  resume.jobId?.name || t('field.notSet'),
                  resume.companyId?.name || t('field.notSet'),
                  ResumeStatusMapping[resume.status as ResumeStatus] || t('field.notSet'),
                  dayjs(resume.createdAt).format('YYYY-MM-DD HH:mm:ss') || t('field.notSet'),
                  // <Button type='link' onClick={() => handleEditClick(resume)}>
                  //   {t('btn.edit')}
                  // </Button>,
                  <div style={{ alignItems: 'center' }}>
                    <Button
                      type='link'
                      href={`${process.env.REACT_APP_API_URL}/images/resume/${resume.url}`}
                      target='_blank'
                      icon={<EyeOutlined />}
                    ></Button>
                    <Button onClick={() => handleEditClick(resume)} icon={<EditOutlined />} type='link' target='_blank' />
                    {/* <Image src={Edit} alt='edit' className='icon-action' style={{ cursor: 'pointer' }} onClick={() => handleEditClick(resume)} /> */}
                  </div>,
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {resumes.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={Math.ceil(totalData / pageSize)} onGetData={fetchData} />
          </div>
        </div>
      )}
      {/* <ResumeTable resumes={resumes} handleEditClick={handleEditClick} /> */}
      <Loading isOpen={isLoading} />

      <Modal title={t('editStatus')} visible={isModalVisible} onCancel={handleModalCancel} footer={null} centered>
        <Form layout='vertical' initialValues={{ status: selectedResume?.status }} onFinish={handleModalSubmit}>
          <Form.Item label={t('field.status')} name='status' rules={[{ required: true, message: t('error.fieldRequired') }]}>
            <Select options={ResumeStatusOptions} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={handleModalCancel} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResumeListByHR;
