import React, { FC, useState } from 'react';
import { Modal, Form, Input, Row, Col, Upload, Button, Select } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadOutlined } from '@ant-design/icons';
import { CreateCompanyModalProps } from './type';
import { uploadLogo } from './api';
import { Alert } from '../../../../../common/utils/popup';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const CreateCompanyModal: FC<CreateCompanyModalProps> = ({ isVisible, onClose, onSubmit, form }) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileChange = async (info: any) => {
    const { file } = info;
    const uploadedFile = file.originFileObj || file;

    if (!uploadedFile) {
      Alert.error({ title: t('error.title'), content: t('toast.error.uploadImage') });
      return;
    }

    try {
      const response = await uploadLogo(uploadedFile);

      if (response?.data?.fileName) {
        const fileName = response.data.fileName;

        form.setFieldsValue({ logo: fileName });
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: response.data.url || '',
          },
        ]);

        Alert.success({ title: t('success.title'), content: t('success.logoUploaded') });
      } else {
        throw new Error(t('error.uploadError'));
      }
    } catch (error) {
      console.error(t('error.uploadError'), error);
      Alert.error({ title: t('error.title'), content: t('error.uploadError') });
      setFileList([]);
    }
  };

  return (
    <Modal width={1000} title={t('companyCreated')} visible={isVisible} onCancel={onClose} footer={null}>
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          const updatedValues = {
            ...values,
            description: form.getFieldValue('description'),
            logo: form.getFieldValue('logo'),
          };
          console.log('Dữ liệu gửi đi:', updatedValues);
          onSubmit(updatedValues);
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('field.companyName')}
              name='name'
              rules={[{ required: true, message: t('field.error.required', { field: t('field.companyName') }) }]}
            >
              <Input placeholder={t('field.companyName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('field.address')}
              name='address'
              rules={[{ required: true, message: t('field.error.required', { field: t('field.address') }) }]}
            >
              <Input placeholder={t('field.location')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('field.logo')}
              name='logo'
              rules={[{ required: true, message: t('field.error.required', { field: t('field.logo') }) }]}
            >
              <Upload listType='picture-card' maxCount={1} fileList={fileList} beforeUpload={() => false} onChange={handleFileChange}>
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>{t('btn.upload')}</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('field.scale')}
              name='scale'
              rules={[{ required: true, message: t('field.error.required', { field: t('field.scale') }) }]}
            >
              <Select placeholder={t('field.scale')}>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
                <Option value={200}>200</Option>
                <Option value={300}>300</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={t('field.description')}
          name='description'
          rules={[{ required: true, message: t('field.error.required', { field: t('field.description') }) }]}
        >
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
        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='primary' htmlType='submit'>
            {t('btn.save')}
          </Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            {t('btn.cancel')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCompanyModal;
