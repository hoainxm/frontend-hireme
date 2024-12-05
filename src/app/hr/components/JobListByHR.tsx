/** @format */

import React, { FC, useEffect, useState } from 'react';
import { fetchJobsByHR } from '../api';
import { createJob, deleteJob } from '../../../app/admin/dashboard/components/job/api';
import { Company, Job } from '../../jobs/model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../common/ui/base';
import { Alert, Confirm } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker, Row, Col, Cascader } from 'antd';
import { experienceOptions, SkillsOptions, Status, WorkForm } from '../../../app/jobs/constant';
import { getAllCompanies } from '../../../app/company/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import JobTable from './JobTable';
import True from '../../../common/ui/assets/images/Success.svg';
import False from '../../../common/ui/assets/icon/Error.svg';
import TrashIcon from '../../../common/ui/assets/ic/20px/trash-bin.svg';
import { Image } from 'react-bootstrap';
import locationData from '../../jobs/components/location.json';

interface Props {
  id: string;
}

interface Ward {
  Id: string;
  Name: string;
  Level: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface City {
  Id: string;
  Name: string;
  Districts: District[];
}

const JobListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [form] = Form.useForm();

  const transformLocationData = (
    data: City[]
  ): { value: string; label: string; children?: { value: string; label: string; children?: { value: string; label: string }[] }[] }[] => {
    return data.map((city) => ({
      value: city.Name,
      label: city.Name,
      // children: city.Districts.map((district) => ({
      //   value: district.Name,
      //   label: district.Name,
      //   children: district.Wards.map((ward) => ({
      //     value: ward.Name,
      //     label: ward.Name,
      //   })),
      // })),
    }));
  };

  const locationOptions = transformLocationData(locationData as City[]);

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.startDate'),
    t('field.endDate'),
    t('field.last_updated'),
    t('field.status'),
    t('field.action'),
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

      const location = values.location ? values.location.join(' - ') : '';

      const formattedData = {
        ...values,
        location,
        company: filteredCompany,
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
        isActive: values.isActive === 'Active',
      };

      delete formattedData.companyId;

      if (!Array.isArray(formattedData.workForm) || formattedData.workForm.length === 0) {
        Alert.error(t('error.invalidWorkForm'));
        return;
      }

      await createJob(formattedData);
      Alert.success({ title: t('success.title'), content: t('success.jobCreated') });
      fetchData(currentPage);
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
          fetchData(currentPage);
        } catch (error) {
          Alert.error({ title: t('error.title'), content: t('error.stWrong') });
        }
      },
    });
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchData(1);
    loadAllCompanies();
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton label={t('btn.admin.addJob')} onClick={() => setIsModalVisible(true)} />
      </div>
      {/* <JobTable jobs={jobs} /> */}
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
                  dayjs(job.startDate).format('DD-MM-YYYY HH:mm:ss'),
                  dayjs(job.endDate).format('DD-MM-YYYY HH:mm:ss'),
                  dayjs(job.updatedAt).format('DD-MM-YYYY HH:mm:ss') || t('field.notSet'),
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Image src={job.isActive ? True : False} alt={job.isActive ? 'Active' : 'Inactive'} width={20} height={20} />
                  </div>,
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Image src={TrashIcon} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => handleDelete(job._id)} />
                  </div>,
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('field.jobName')} name='name' rules={[{ required: true, message: t('field.error.required') }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('field.skills')} name='skills' rules={[{ required: true, message: t('field.error.required') }]}>
                <Select
                  mode='multiple'
                  placeholder={t('field.skillsPlaceholder')}
                  options={SkillsOptions.map((skill) => ({ value: skill, label: skill }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.error.required') }]}>
                <Select placeholder={t('field.selectCompany')} onChange={handleCompanyChange}>
                  {companies.map((company) => (
                    <Select.Option key={company._id} value={company._id}>
                      {company.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('field.location')} name='location' rules={[{ required: true, message: t('field.error.required') }]}>
                <Cascader options={locationOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('field.salary')}
                name='salary'
                rules={[{ required: true, type: 'number', min: 0, message: t('field.error.required') }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('jobDetail.quantity')}
                name='quantity'
                rules={[{ required: true, type: 'number', min: 1, message: t('field.error.required') }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('field.workForm')} name='workForm' rules={[{ required: true, message: t('field.error.required') }]}>
                <Select
                  mode='multiple'
                  placeholder={t('field.workFormPlaceholder')}
                  options={WorkForm.map((form) => ({ value: form, label: form }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('field.level')} name='level' rules={[{ required: true, message: t('field.error,required') }]}>
                <Select placeholder={t('field.levelPlaceholder')} options={experienceOptions.map((level) => ({ value: level, label: level }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('field.yearsExperience')}
                name='experience'
                rules={[{ required: true, type: 'number', min: 0, message: t('field.error.required') }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form
                form={form}
                layout='vertical'
                onFinish={handleFormSubmit}
                initialValues={{
                  isActive: 'Active',
                }}
              >
                <Form.Item label={t('field.status')} name='isActive' rules={[{ required: true, message: t('field.error.required') }]}>
                  <Select placeholder={t('field.selectStatus')}>
                    {Status.map((status) => (
                      <Select.Option key={status} value={status}>
                        {status}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('description')} name='description' rules={[{ required: true, message: t('field.error.required') }]}>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue('description') || ''}
                  onReady={(editor) => {
                    const editableElement = editor.ui.view.editable?.element;
                    if (editableElement) {
                      editableElement.style.minHeight = '250px';
                    }
                  }}
                  onChange={(_, editor) => {
                    const data = editor.getData();
                    form.setFieldsValue({ description: data });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t('field.startDate')} name='startDate' rules={[{ required: true, message: t('field.required') }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('field.endDate')} name='endDate' rules={[{ required: true, message: t('field.required') }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify='end'>
            <Col>
              <Button type='primary' htmlType='submit'>
                {t('btn.save')}
              </Button>
              <Button onClick={handleModalClose} style={{ marginLeft: '8px' }}>
                {t('btn.cancel')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default JobListByHR;
