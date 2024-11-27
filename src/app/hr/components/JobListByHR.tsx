/** @format */

import React, { FC, useEffect, useState } from 'react';
import { createJob, fetchJobsByHR } from '../api';
import { Job } from '../../jobs/model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../common/ui/base';
import { Alert } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { PageURL } from '@models/enum';
import { useHistory } from 'react-router-dom';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker } from 'antd';
import { experienceOptions, SkillsOptions } from '../../../app/jobs/constant';

interface Props {
  id: string;
}

const JobListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.last_updated'),
  ];

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchJobsByHR(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setJobs(result);
        setCurrentPage(meta.current);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const handleModalClose = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      await createJob({
        ...values,
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
      });
      Alert.success({ title: t('success.title'), content: t('success.jobCreated') });
      fetchData(currentPage);
      handleModalClose();
    } catch (error) {
      Alert.error({ title: t('error.title'), content: t('error.createJobFailed') });
      handleModalClose();
    }
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchData(1);
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton label={t('btn.admin.addJob')} onClick={() => setIsModalVisible(true)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <CTRow
                key={job._id}
                data={[
                  index + 1,
                  job.name || t('field.notSet'),
                  job.company.name || t('field.notSet'),
                  job.location || t('field.notSet'),
                  `${job.salary.toLocaleString()} VND` || t('field.notSet'),
                  dayjs(job.updatedAt).format('YYYY-MM-DD HH:mm:ss') || t('field.notSet'),
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {jobs.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={Math.ceil(totalData / pageSize)} onGetData={fetchData} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />

      <Modal title={t('btn.admin.addJob')} visible={isModalVisible} onCancel={handleModalClose} footer={null} centered>
        <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
          <Form.Item label={t('field.jobName')} name='name' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('field.skills')} name='skills' rules={[{ required: true, message: t('field.required') }]}>
            <Select mode='tags' placeholder={t('field.skillsPlaceholder')} options={SkillsOptions.map((skill) => ({ value: skill, label: skill }))} />
          </Form.Item>
          <Form.Item label={t('field.companyName')} name='companyId' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('field.location')} name='location' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('field.salary')} name='salary' rules={[{ required: true, message: t('field.required') }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('jobDetail.quantity')} name='quantity' rules={[{ required: true, message: t('field.required') }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('field.level')} name='level' rules={[{ required: true, message: t('field.required') }]}>
            <Select placeholder={t('field.levelPlaceholder')} options={experienceOptions.map((level) => ({ value: level, label: level }))} />
          </Form.Item>
          <Form.Item label={t('field.description')} name='description'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label={t('field.startDate')} name='startDate' rules={[{ required: true, message: t('field.required') }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('field.endDate')} name='endDate' rules={[{ required: true, message: t('field.required') }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          {/* <Form.Item label={t('field.active')} name='isActive' valuePropName='checked'>
            <Input type='checkbox' />
          </Form.Item> */}
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={handleModalClose} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobListByHR;
