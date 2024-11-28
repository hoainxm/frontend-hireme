import React, { FC, useState } from 'react';
import { Modal, Form, Input, Row, Col, Upload, Button, Select } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadOutlined } from '@ant-design/icons';
import { CreateCompanyModalProps } from './type';
import { uploadLogo } from './api';

const { Option } = Select;

const CreateCompanyModal: FC<CreateCompanyModalProps> = ({ isVisible, onClose, onSubmit, form }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleFileChange = async (info: any) => {
    const { file, fileList } = info;

    setFileList(fileList);

    if (file.status === 'done' || file.status === 'uploading') {
      try {
        const uploadedFile = file.originFileObj || file;
        if (!uploadedFile) {
          console.error('Không tìm thấy file gốc!');
          return;
        }

        const response = await uploadLogo(uploadedFile);
        const fileName = response.data.fileName;

        form.setFieldsValue({ logo: fileName });
      } catch (error) {
        console.error('Lỗi upload file:', error);
      }
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  return (
    <Modal width={1000} title='Tạo mới Company' visible={isVisible} onCancel={onClose} footer={null}>
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          const updatedValues = {
            ...values,
            description: form.getFieldValue('description'),
          };
          onSubmit(updatedValues);
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Tên công ty' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}>
              <Input placeholder='Nhập tên công ty' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]}>
              <Input placeholder='Nhập địa chỉ công ty' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Ảnh Logo' name='logo' rules={[{ required: true, message: 'Vui lòng upload ảnh logo!' }]}>
              <Upload
                listType='picture-card'
                maxCount={1}
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
                onPreview={handlePreview}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Quy mô' name='scale' rules={[{ required: true, message: 'Vui lòng chọn quy mô!' }]}>
              <Select placeholder='Chọn quy mô'>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
                <Option value={200}>200</Option>
                <Option value={300}>300</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Miêu tả' name='description' rules={[{ required: true, message: 'Vui lòng nhập miêu tả!' }]}>
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
            Tạo mới
          </Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            Hủy
          </Button>
        </Form.Item>
      </Form>

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
        <img alt='Preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default CreateCompanyModal;
