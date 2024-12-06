/** @format */

import React, { FC, useEffect, useState } from 'react';
import { CButton, CTPaging, CTPageSize, CTRow, CTable, BlankFrame, Loading } from '../../../../../common/ui/base';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { useTranslation } from 'react-i18next';
import { fetchJobsByAdmin, deleteJob, createJob } from './api';
import { getAllCompanies } from '../../../../../app/company/api';
import { Company, Job } from '../../../../jobs/model';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import dayjs from 'dayjs';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { Image } from 'react-bootstrap';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import { experienceOptions, SkillsOptions, Status, WorkForm } from '../../../../../app/jobs/constant';
import True from '../../../../../common/ui/assets/images/Success.svg';
import False from '../../../../../common/ui/assets/icon/Error.svg';

interface Props {
  id: string;
}

const { Option } = Select;

export const JobListedByAdmin: FC<Props> = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [form] = Form.useForm();

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.name'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.startDate'),
    t('field.endDate'),
    t('field.status'),
    // t('field.action'),
  ];

  const fetchAllJobs = (page: number) => {
    setIsLoading(true);
    fetchJobsByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setJobs(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: t('error.title'), content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const loadAllCompanies = async () => {
    try {
      const res = await getAllCompanies(1, 100);
      setCompanies((res.data as any).result);
    } catch (error) {
      Alert.error(t('error.fetchCompaniesFailed'));
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const selected = companies.find((company) => company._id === companyId);
    setSelectedCompany(selected || null);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (!selectedCompany) {
        Alert.error(t('error.companyNotSelected'));
        return;
      }

      const filteredCompany = {
        _id: selectedCompany._id,
        name: selectedCompany.name,
        logo: selectedCompany.logo,
        scale: selectedCompany.scale,
      };

      const formattedData = {
        ...values,
        company: filteredCompany,
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
      };

      delete formattedData.companyId;

      await createJob(formattedData);
      Alert.success({ title: t('success.title'), content: t('success.jobCreated') });
      fetchAllJobs(currentPage);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      Alert.error({ title: t('error.title'), content: t('error.createJobFailed') });
    }
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteJob'),
      content: t('confirm.deleteJobContent'),
      onConfirm: () => {
        try {
          deleteJob(id);
          Alert.success({ title: t('success.title'), content: t('success.jobDeleted') });
          fetchAllJobs(currentPage);
        } catch (error) {
          Alert.error({ title: t('error.title'), content: t('error.stWrong') });
        }
      },
    });
  };

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const res = await getAllCompanies(1, 100);
        setCompanies((res.data as any).result);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchAllCompanies();
    fetchAllJobs(1);
    loadAllCompanies();
    // eslint-disable-next-line
  }, [pageSize]);

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  return (
    <div>
      {/* <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('btn.admin.addJob')} onClick={() => setIsModalVisible(true)} />
      </div> */}
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
                  job.name,
                  job.company?.name || t('field.notSet'),
                  job.location || t('field.notSet'),
                  `${job.salary.toLocaleString()} VND`,
                  dayjs(job.startDate).format('DD-MM-YYYY'),
                  dayjs(job.endDate).format('DD-MM-YYYY'),
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Image src={job.isActive ? True : False} alt={job.isActive ? 'Active' : 'Inactive'} width={20} height={20} />
                  </div>,

                  // <Image
                  //   src={TrashIcon}
                  //   alt={t('action.delete')}
                  //   className='icon-action ml-3'
                  //   style={{ cursor: 'pointer' }}
                  //   onClick={() => handleDelete(job._id)}
                  // />,
                ]}
                // onClick={() => history.push(`${PageURL.ADMIN_MANAGE_JOB}/update/${job._id}`)}
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
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllJobs} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />

      <Modal title={t('btn.admin.addJob')} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} centered>
        <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
          <Form.Item label={t('field.jobName')} name='name' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.skills')} name='skills' rules={[{ required: true, message: t('field.required') }]}>
            <Select mode='tags' placeholder={t('field.skillsPlaceholder')} options={SkillsOptions.map((skill) => ({ value: skill, label: skill }))} />
          </Form.Item>

          <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.required') }]}>
            <Select placeholder={t('field.selectCompany')} onChange={handleCompanyChange}>
              {companies.map((company) => (
                <Select.Option key={company._id} value={company._id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
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

          <Form.Item
            label={t('field.workForm')}
            name='workForm'
            rules={[
              { required: true, message: t('field.required') },
              {
                type: 'array',
                message: t('field.invalidArray'),
              },
            ]}
          >
            <Select mode='multiple' placeholder={t('field.workFormPlaceholder')} options={WorkForm.map((form) => ({ value: form, label: form }))} />
          </Form.Item>

          <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.required') }]}>
            <Select
              placeholder={t('field.genderPlaceholder')}
              options={[
                { value: 'Nam', label: t('male') },
                { value: 'Nữ', label: t('female') },
                { value: 'Không yêu cầu', label: t('notRequired') },
              ]}
            />
          </Form.Item>

          <Form.Item label={t('field.yearsExperience')} name='experience' rules={[{ required: true, message: t('field.required') }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label={t('field.description')} name='description' rules={[{ required: true, message: t('field.required') }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label={t('field.startDate')} name='startDate' rules={[{ required: true, message: t('field.required') }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label={t('field.endDate')} name='endDate' rules={[{ required: true, message: t('field.required') }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label={t('field.status')} name='isActive' rules={[{ required: true, message: t('field.required') }]}>
            <Select placeholder={t('field.selectStatus')}>
              {Status.map((status) => (
                <Select.Option key={status} value={status === 'Active'}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobListedByAdmin;
