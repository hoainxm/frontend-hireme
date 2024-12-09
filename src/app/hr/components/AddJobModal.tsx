/** @format */

import React, { FC, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker, Row, Col, Cascader } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import locationData from '../../jobs/components/location.json';
import { createJob, fetchCompanyById } from '../api';
import { Alert } from '../../../common/utils/popup';

interface City {
  Id: string;
  Name: string;
  Districts: District[];
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

interface AddJobModalProps {
  idCompany: string | undefined;
  visible: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
  skillsOptions: { value: string; label: string }[];
  workFormOptions: { value: string; label: string }[];
  experienceOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  genderOptions: { value: string; label: string }[];
}

const AddJobModal: FC<AddJobModalProps> = ({
  idCompany,
  visible,
  onClose,
  skillsOptions,
  workFormOptions,
  experienceOptions,
  statusOptions,
  genderOptions,
  onCreateSuccess,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [filteredCities, setFilteredCities] = useState<{ value: string; label: string }[]>([]);

  const handleCitySearch = (inputValue: string) => {
    const filtered = locationData
      .filter((city) => city.Name.toLowerCase().includes(inputValue.toLowerCase()))
      .map((city) => ({
        value: city.Name,
        label: city.Name,
      }));

    setFilteredCities(filtered);
  };

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
  useEffect(() => {
    setFilteredCities(locationOptions);
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      if (idCompany) {
        const result = await fetchCompanyById(idCompany);
        const location = values.location ? values.location.join(' - ') : '';
        const infoCompany = {
          _id: result.data?._id,
          name: result.data?.name,
          logo: result.data?.logo,
          scale: result.data?.scale,
        };

        const formattedData = {
          ...values,
          location,
          company: infoCompany,
          startDate: dayjs(values.startDate).toISOString(),
          endDate: dayjs(values.endDate).toISOString(),
          isActive: values.isActive === 'Active',
        };
        await createJob(formattedData);
        Alert.success({ title: t('success.title'), content: t('success.jobCreated') });
        onCreateSuccess();
        form.resetFields();
        onClose();
      }
    } catch (error) {
      Alert.error({ title: t('error.title'), content: t('error.createJobFailed') });
    }
  };

  return (
    <Modal title={t('btn.admin.addJob')} visible={visible} onCancel={onClose} footer={null} width={1000} centered>
      <Form form={form} layout='vertical' onFinish={handleFormSubmit}>
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
              <Select
                showSearch
                placeholder={t('field.provincePlaceholder')}
                onSearch={handleCitySearch}
                options={filteredCities.length > 0 ? filteredCities : locationOptions}
                filterOption={false}
              />
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
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('jobDetail.quantity')}
              name='quantity'
              rules={[{ required: true, type: 'number', min: 1, message: t('field.error.required') }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('field.workForm')} name='workForm' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select
                mode='multiple'
                options={workFormOptions}
                placeholder={t('field.workFormPlaceholder')}
                onInputKeyDown={(e) => e.preventDefault()}
              />
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
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
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
                    if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
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
                data=''
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

        <Row justify='end'>
          <Col>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={onClose} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddJobModal;
