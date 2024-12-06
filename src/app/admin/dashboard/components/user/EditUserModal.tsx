import React, { FC } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { PremiumPlanMapping } from '../../constants';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  selectedUser: any | null;
}

const EditUserModal: FC<EditUserModalProps> = ({ visible, onClose, onSubmit, selectedUser }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal title={t('editProfile')} visible={visible} onCancel={handleCancel} footer={null} centered>
      <Form
        layout='vertical'
        onFinish={onSubmit}
        form={form}
        initialValues={{
          ...selectedUser,
          dateOfBirth: selectedUser?.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null,
        }}
      >
        <Form.Item label={t('field.fullName')} name='name'>
          <Input disabled />
        </Form.Item>

        <Form.Item label={t('field.email')} name='email'>
          <Input disabled />
        </Form.Item>

        <Form.Item label={t('field.premium')} name='isPremium' rules={[{ required: true }]}>
          <Select>
            {Object.keys(PremiumPlanMapping).map((key) => (
              <Select.Option key={key} value={key}>
                {PremiumPlanMapping[key]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('field.verified')} name='isVerify' rules={[{ required: true }]}>
          <Select>
            <Select.Option value={true}>{t('field.verified')}</Select.Option>
            <Select.Option value={false}>{t('field.unverified')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
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

export default EditUserModal;
