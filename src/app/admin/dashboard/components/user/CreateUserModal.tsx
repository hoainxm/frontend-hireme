import React, { FC } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Cascader } from 'antd';
import { useTranslation } from 'react-i18next';
import { ROLES } from '../../constants';
import { CompanyId } from '../../../../../app/profile/model';

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  companies: { _id: string; name: string }[];
  locationOptions: any[];
  setSelectedRole: (role: string | undefined) => void;
  selectedRole?: string;
}

const CreateUserModal: FC<CreateUserModalProps> = ({ visible, onClose, onSubmit, companies, locationOptions, setSelectedRole, selectedRole }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal title={t('btn.admin.addUser')} visible={visible} onCancel={handleCancel} footer={null} centered>
      <Form layout='vertical' onFinish={onSubmit} form={form}>
        <Form.Item label={t('field.fullName')} name='name' rules={[{ required: true, message: t('field.error.required') }]}>
          <Input />
        </Form.Item>

        <Form.Item label={t('field.email')} name='email' rules={[{ required: true, type: 'email', message: t('field.error.email') }]}>
          <Input />
        </Form.Item>

        <Form.Item label={t('field.password')} name='password' rules={[{ required: true, message: t('field.error.required') }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.error.required') }]}>
          <Select>
            <Select.Option value='Nam'>{t('field.male')}</Select.Option>
            <Select.Option value='Nữ'>{t('field.female')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={t('field.address')} name='address' rules={[{ required: true, message: t('field.error.required') }]}>
          <Cascader options={locationOptions} />
        </Form.Item>

        <Form.Item label={t('field.role')} name='role' rules={[{ required: true, message: t('field.error.required') }]}>
          <Select onChange={(value) => setSelectedRole(value)}>
            {ROLES.map((role) => (
              <Select.Option key={role._id} value={role._id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedRole === '66376960e60f6eda1161fdf2' && (
          <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.error.required') }]}>
            <Select placeholder={t('field.selectCompany')}>
              {companies.map((company) => (
                <Select.Option key={company._id} value={company._id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label={t('support.phone')}
          name='phone'
          rules={[
            { required: true, message: t('field.error.required') },
            { pattern: /^\d+$/, message: t('field.error.invalidPhone') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={t('field.birthday')} name='dateOfBirth' rules={[{ required: true, message: t('field.error.required') }]}>
          <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='primary' htmlType='submit'>
            {t('btn.save')}
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: '8px' }}>
            {t('btn.cancel')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
