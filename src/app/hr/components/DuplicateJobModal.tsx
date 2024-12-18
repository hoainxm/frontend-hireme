/** @format */

import React, { FC, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker, Row, Col, Cascader } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import locationData from '../../jobs/components/location.json';
import { createJob } from '../api';
import { Alert } from '../../../common/utils/popup';

interface DuplicateJobModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  job?: any; // The existing job data to duplicate
  skillsOptions: { value: string; label: string }[];
  workFormOptions: { value: string; label: string }[];
  experienceOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  genderOptions: { value: string; label: string }[];
}

const DuplicateJobModal: FC<DuplicateJobModalProps> = ({
  visible,
  onClose,
  onCreateSuccess,
  job,
  skillsOptions,
  workFormOptions,
  experienceOptions,
  statusOptions,
  genderOptions,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const transformLocationData = (data: any): { value: string; label: string; children?: { value: string; label: string }[] }[] => {
    return data.map((city: any) => ({
      value: city.Name,
      label: city.Name,
    }));
  };

  const locationOptions = transformLocationData(locationData);

  const handleFormSubmit = async (values: any) => {
    try {
      const location = values.location ? values.location.join(' - ') : '';

      // Ensure the company object is included
      const company = job?.company
        ? {
            _id: job.company._id,
            name: job.company.name,
            logo: job.company.logo,
            scale: job.company.scale,
          }
        : {};

      const formattedData = {
        ...values,
        company, // Add company information
        location,
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
        isActive: values.isActive === 'Active',
      };

      await createJob(formattedData);
      Alert.success({ title: t('success.title'), content: t('success.jobCreated') });
      onCreateSuccess();
      form.resetFields();
      onClose();
    } catch (error) {
      Alert.error({ title: t('error.title'), content: t('error.createJobFailed') });
    }
  };

  useEffect(() => {
    if (job) {
      // Populate form with job details
      form.setFieldsValue({
        ...job,
        location: job.location ? job.location.split(' - ') : [],
        startDate: job.startDate ? dayjs(job.startDate) : null,
        endDate: job.endDate ? dayjs(job.endDate) : null,
        isActive: job.isActive ? 'Active' : 'Inactive',
      });
    } else {
      form.resetFields();
    }
  }, [job]);

  return (
    <Modal
      title={t('btn.admin.duplicateJob')}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={1000}
      centered
    >
      <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
        {/* Form Fields */}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={t('field.jobName')} name='name' rules={[{ required: true, message: t('field.error.required') }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.skills')} name='skills' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select mode='multiple' placeholder={t('field.skillsPlaceholder')} options={skillsOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.location')} name='location' rules={[{ required: true, message: t('field.error.required') }]}>
              <Cascader options={locationOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('field.salary')}
              name='salary'
              rules={[{ required: true, type: 'number', min: 0, message: t('field.error.required') }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('jobDetail.quantity')}
              name='quantity'
              rules={[{ required: true, type: 'number', min: 1, message: t('field.error.required') }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.workForm')} name='workForm' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select mode='multiple' options={workFormOptions} placeholder={t('field.workFormPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={t('field.level')} name='level' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('field.levelPlaceholder')} options={experienceOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('field.yearsExperience')}
              name='experience'
              rules={[{ required: true, type: 'number', min: 0, message: t('field.error.required') }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('field.status')}
              name='isActive'
              initialValue='Active'
              rules={[{ required: true, message: t('field.error.required') }]}
            >
              <Select placeholder={t('field.selectStatus')} options={statusOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('field.gender')} options={genderOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.startDate')} name='startDate' rules={[{ required: true, message: t('field.error.required') }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('field.endDate')}
              name='endDate'
              rules={[
                { required: true, message: t('field.error.required') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.isAfter(getFieldValue('startDate'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('field.error.endDateAfterStartDate')));
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={t('field.description')} name='description' rules={[{ required: true, message: t('field.error.required') }]}>
              <CKEditor
                editor={ClassicEditor}
                data={job?.description || ''}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  form.setFieldsValue({ description: data });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='end'>
          <Col>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                onClose();
              }}
              style={{ marginLeft: '8px' }}
            >
              {t('btn.cancel')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DuplicateJobModal;
