/** @format */

import React, { FC, useState, useEffect } from 'react';
import { fetchResumesByHR, updateResumeStatus } from '../api';
import { Resume } from '../model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../common/ui/base';
import { Alert } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ResumeStatus, ResumeStatusMapping, ResumeStatusOptions } from '../model';
import { Modal, Form, Select, Button, Input } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

interface Props {
  id: string;
}

const ResumeListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const TABLE_HEADER = [t('field.numeric'), t('field.email'), t('field.jobName'), t('field.status'), t('field.submissionTime'), t('field.action')];

  const fetchData = () => {
    setIsLoading(true);
    fetchResumesByHR(1, 1000)
      .then((res) => {
        const { result } = res.data;
        setResumes(result);
        setFilteredResumes(result);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const applyFilters = () => {
    let filtered = [...resumes];

    if (searchValue) {
      const lowerValue = searchValue.toLowerCase();
      filtered = filtered.filter(
        (resume) =>
          resume.email.toLowerCase().includes(lowerValue) ||
          (resume.jobId?.name && resume.jobId.name.toLowerCase().includes(lowerValue)) ||
          (resume.status && ResumeStatusMapping[resume.status]?.toLowerCase().includes(lowerValue))
      );
    }

    if (sortOrder === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setFilteredResumes(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [resumes, searchValue, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'newest' ? 'oldest' : 'newest'));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1);
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
        fetchData();
      } catch {
        Alert.error({ title: t('error.title'), content: t('error.updateResume') });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className='d-flex justify-content-between mb-3'>
        <Input.Search
          type='text'
          placeholder={t('field.search')}
          value={searchValue}
          onChange={handleSearchChange}
          style={{ marginBottom: '16px', maxWidth: '300px' }}
        />
        <Button type='primary' onClick={handleSortToggle}>
          {sortOrder === 'newest' ? t('sort.by.oldest') : t('sort.by.recent')}
        </Button>
      </div>

      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {filteredResumes.length > 0 ? (
            filteredResumes.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((resume, index) => (
              <CTRow
                key={resume._id}
                data={[
                  index + 1 + (currentPage - 1) * pageSize,
                  resume.email || t('field.notSet'),
                  resume.jobId?.name || t('field.notSet'),
                  ResumeStatusMapping[resume.status as ResumeStatus] || t('field.notSet'),
                  dayjs(resume.createdAt).format('HH:mm:ss DD-MM-YYYY') || t('field.notSet'),
                  <div style={{ alignItems: 'center' }}>
                    <Button
                      type='link'
                      href={`${process.env.REACT_APP_API_URL}/images/resume/${resume.url}`}
                      target='_blank'
                      icon={<EyeOutlined />}
                    ></Button>
                    <Button onClick={() => handleEditClick(resume)} icon={<EditOutlined />} type='link' target='_blank' />
                  </div>,
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {filteredResumes.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={filteredResumes.length} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging
              className='mt-4'
              currentPage={currentPage}
              totalPage={Math.ceil(filteredResumes.length / pageSize)}
              onGetData={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />

      <Modal title={t('editStatus')} visible={isModalVisible} onCancel={handleModalCancel} footer={null} centered>
        <Form layout='vertical' initialValues={{ status: selectedResume?.status }} onFinish={handleModalSubmit}>
          <Form.Item label={t('field.status')} name='status' rules={[{ required: true, message: t('error.fieldRequired') }]}>
            <Select options={ResumeStatusOptions} />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
