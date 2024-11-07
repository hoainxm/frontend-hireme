import React, { useState, useEffect, HTMLAttributes, FC } from 'react';
import { Input, Button, Form, message, Spin, Avatar } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { UserProfile } from '../auth/models';
import { getUserProfile } from './api';
import style from '../profile/profile.module.scss';
import MainLayout from '@layout/main-layout';
import { useTranslation } from 'react-i18next';
import { PageName } from '@models/enum';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

export const ProfileUser: FC<Props> = ({ sectionId }) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile();
      console.log(response);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      message.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <Spin tip='Loading profile...' />;
  }

  return (
    <MainLayout active={PageName.PROFILE_MANAGEMENT}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('user.profile.management')}
              <h5>{t('user.profile.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <div className={style['profile-container']}>
        <h2 className={style['profile-container__title']}>Thông tin cá nhân</h2>
        <div className={style['profile-container__avatar-container']}>
          <Avatar src={user?.avatar} icon={<UserOutlined />} size={64} />
        </div>
        <Form form={form} layout='vertical' className={style['profile-container__form-container']}>
          <Form.Item label='Họ tên' name='name' className={style['profile-container__form-item']}>
            <Input prefix={<UserOutlined />} disabled={!isEditing} />
          </Form.Item>

          <Form.Item label='Email' name='email' className={style['profile-container__form-item']}>
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>

          <Form.Item label='Vai trò' name={['role', 'name']} className={style['profile-container__form-item']}>
            <Input disabled />
          </Form.Item>

          <Form.Item label='Quyền hạn' className={style['profile-container__form-item']}>
            <Input.TextArea value={user?.permissions.map((perm) => perm.name).join(', ')} disabled rows={4} />
          </Form.Item>

          <div className={style['profile-container__button-container']}>
            {isEditing ? <Button type='primary'>Lưu</Button> : <Button onClick={handleEdit}>Chỉnh sửa</Button>}
          </div>
        </Form>
      </div>
    </MainLayout>
  );
};

export default ProfileUser;
