import React, { FC, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker, Row, Col, Cascader } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { experienceOptions, GenderOptions, SkillsOptions, WorkForm } from '../../../app/jobs/constant';
import dayjs from 'dayjs';
import { editJob } from '../api';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../../common/utils/popup';
import locationData from '../../jobs/components/location.json';

interface Props {
  visible: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  job: any;
  companies: any[];
}

const EditJobModal: FC<Props> = ({ visible, onClose, onEditSuccess, job, companies }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);

  useEffect(() => {
    setFilteredLocations(transformLocationData(locationData));
  }, []);

  useEffect(() => {
    if (job) {
      form.setFieldsValue({
        ...job,
        skills: job.skills,
        location: job.location ? job.location.split(' - ') : [],
        startDate: dayjs(job.startDate),
        endDate: dayjs(job.endDate),
        isActive: job.isActive ? 'Active' : 'Inactive',
      });
    }
  }, [job, form]);

  const transformLocationData = (data: any[]): any[] =>
    data.map((city) => ({
      value: city.Name,
      label: city.Name,
      // children: city.Districts.map((district: any) => ({
      //   value: district.Name,
      //   label: district.Name,
      //   children: district.Wards.map((ward: any) => ({
      //     value: ward.Name,
      //     label: ward.Name,
      //   })),
      // })),
    }));

  const handleLocationSearch = (value: string) => {
    const filtered = transformLocationData(locationData).filter((city) => city.label.toLowerCase().includes(value.toLowerCase()));
    setFilteredLocations(filtered);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const formattedData = {
        ...values,
        location: values.location ? values.location.join(' - ') : '',
        startDate: values.startDate ? values.startDate.toISOString() : '',
        endDate: values.endDate ? values.endDate.toISOString() : '',
      };

      await editJob(job._id, formattedData);
      onEditSuccess();
      Alert.success({ title: t('success.title'), content: t('jobUpdated') });
      form.resetFields();
      onClose();
    } catch (error) {
      Alert.error({ title: t('error.title'), content: t('updateJobFailed') });
    }
  };

  return (
    <Modal title={t('editModalTitle')} visible={visible} onCancel={onClose} footer={null} centered>
      <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('jobName')} name='name' rules={[{ required: true, message: t('field.error.required') }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('skills')} name='skills' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select mode='multiple' placeholder={t('selectSkills')} options={SkillsOptions.map((skill) => ({ value: skill, label: skill }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('location')} name='location' rules={[{ required: true, message: t('field.error.required') }]}>
              <Cascader
                options={filteredLocations}
                showSearch={{ filter: () => true }}
                placeholder={t('job.selectLocation')}
                onSearch={handleLocationSearch}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('salary')} name='salary' rules={[{ required: true, type: 'number', min: 0, message: t('field.error.required') }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('quantity')} name='quantity' rules={[{ required: true, type: 'number', min: 1, message: t('field.error.required') }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('level')} name='level' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('selectLevel')} options={experienceOptions.map((level) => ({ value: level, label: level }))} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('field.workForm')} name='workForm' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('field.workFormPlaceholder')} options={WorkForm.map((form) => ({ value: form, label: form }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('field.genderPlaceholder')} options={GenderOptions.map((gender) => ({ value: gender, label: gender }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('status')} name='isActive' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('selectStatus')}>
                <Select.Option value='Active'>{t('status.active')}</Select.Option>
                <Select.Option value='Inactive'>{t('status.inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item label={t('description')} name='description' rules={[{ required: true, message: t('field.error.required') }]}>
              <CKEditor
                editor={ClassicEditor}
                data={form.getFieldValue('description') || ''}
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
              {t('save')}
            </Button>
            <Button onClick={onClose} style={{ marginLeft: '8px' }}>
              {t('cancel')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditJobModal;
