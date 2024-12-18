import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Select, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { SkillsOptions } from '../constant';
import { RootState, useAppSelector } from '../../../store/store';
import { getSkills, setSubscriber, updateSubscriber } from '../../../app/upgrade/api';

interface ModalSendJobProps {
  visible: boolean;
  onClose: () => void;
}

const { Text } = Typography;

const ModalSendJob: React.FC<ModalSendJobProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const userInfo = useAppSelector((state: RootState) => state.user.userProfile);

  const handleSkillChange = (value: string[]) => {
    setSelectedSkills(value);
  };

  const fetchSkills = async () => {
    try {
      const res = await getSkills();
      if (res && res.statusCode === 201) {
        setSelectedSkills(res.data.skills);
        setIsUpdating(res.data.skills.length > 0);
      }
    } catch (error) {
      console.error('Lỗi khi fetch skills:', error);
      message.error(t('notification.fetchError'));
    }
  };

  const handleConfirm = async () => {
    const lowercaseSkills = selectedSkills.map((skill) => skill.toLowerCase());

    const dataSubscriber = { name: userInfo.name, email: userInfo.email, skills: lowercaseSkills };

    const result = await setSubscriber(dataSubscriber);
    if (result && result.statusCode === 201) {
      message.success('Chúc mừng bạn đã tạo thông báo việc làm thành công.');
    }
    onClose();
  };

  const handleUpdate = async () => {
    const lowercaseSkills = selectedSkills.map((skill) => skill.toLowerCase());
    const dataSubscriber = { name: userInfo.name, email: userInfo.email, skills: lowercaseSkills };
    const result = await updateSubscriber(dataSubscriber);
    if (result) {
      message.success('Cập nhật skills thành công.');
    }
    onClose();
  };

  useEffect(() => {
    if (visible) {
      fetchSkills();
    }
  }, [visible]);

  return (
    <Modal
      title={t('jobDetail.similarJobsTitle')}
      centered
      visible={visible}
      onOk={isUpdating ? handleUpdate : handleConfirm}
      onCancel={onClose}
      width={700}
      okText={isUpdating ? t('modal.update') : t('modal.confirm')}
      cancelText={t('modal.cancel')}
    >
      <Row align='middle' style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
        <Text strong style={{ whiteSpace: 'nowrap' }}>
          {t('field.skills')}:
        </Text>
        <Select
          mode='multiple'
          showSearch
          placeholder={t('field.searchSkills')}
          style={{ flex: 1, minWidth: '0' }}
          onChange={handleSkillChange}
          value={selectedSkills}
          filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
          options={SkillsOptions.map((skill) => ({ value: skill, label: skill }))}
        />
      </Row>

      <div style={{ marginTop: '16px', fontStyle: 'italic', color: '#888' }}>
        <Text style={{ color: 'red' }}>
          {t('jobDetail.note')}: Bạn sẽ nhận được email dựa trên các công việc theo skills của bạn vào mỗi cuối tuần.
        </Text>
      </div>
    </Modal>
  );
};

export default ModalSendJob;
