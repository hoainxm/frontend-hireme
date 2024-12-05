import React, { useState, useEffect, HTMLAttributes, FC, useRef } from 'react';
import { Avatar, Button, Layout, Menu, Typography, Card, Row, Col, Divider, Modal, message, List, Form, Input, Select, DatePicker } from 'antd';
import { UserOutlined, CameraOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { UserProfile } from '../auth/models';
import { getUserProfile, updateMe, uploadAvatar } from './api';
import style from '../profile/profile.module.scss';
import modalStyle from './UploadAvatarModal.module.scss';
import MainLayout from '@layout/main-layout';
import { useTranslation } from 'react-i18next';
import { PageName } from '@models/enum';
import { Account } from '@icon/icon';
import { SkillsOptions } from '../../app/jobs/constant';
import HistoryApply from './HistoryApply';
import { useAppDispatch } from '../../store/store';
import { getUserProfileThunk } from '../../store/reducer/userSlice/userThunk';
import MyCV from './MyCV';
import dayjs from 'dayjs';
import { UpdateMe } from './model';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export const ProfileUser: FC<Props> = ({ sectionId }) => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [mappedSkills, setMappedSkills] = useState<string[]>([]);
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const fetchInfo = async () => {
    try {
      const res = await getUserProfile();
      if (res && res.data) {
        setUserInfo(res.data);
        const mapped = res.data.skills
          .map((userSkill) => SkillsOptions.find((option) => option.toLowerCase() === userSkill.toLowerCase()))
          .filter((skill): skill is string => Boolean(skill));
        setMappedSkills(mapped);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleAvatarClick = () => {
    setIsModalVisible(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setPreviewImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmUpload = async () => {
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];
      try {
        const response = await uploadAvatar(file);
        message.success('Avatar uploaded successfully');
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo!,
          avatar: response.avatar,
        }));
        setIsModalVisible(false);
        setPreviewImage(null);
        await fetchInfo();
        await dispatch(getUserProfileThunk()).unwrap();
      } catch (error) {
        message.error('Failed to upload avatar');
        console.error(error);
      }
    }
  };

  const avatarSrc = userInfo?.avatar?.startsWith('http')
    ? userInfo.avatar
    : userInfo
    ? `${process.env.REACT_APP_API_URL}/images/avatar/${userInfo.avatar || ''}`
    : Account;
  console.log(userInfo);
  const handlePreviewClick = () => {
    setIsImagePreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setIsImagePreviewVisible(false);
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = async (values: UpdateMe) => {
    const formattedData = {
      ...values,
      gender: values.gender === t('undefined') ? '' : values.gender,
      dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
      skills: values.skills.map((skill: string) => skill.toLowerCase()),
    };

    console.log('Formatted Data:', formattedData);

    try {
      if (!userInfo?._id) {
        throw new Error('User ID is missing');
      }

      const response = await updateMe(userInfo._id, formattedData);
      message.success('Information has been updated successfully!');
      setUserInfo(response.data);
      setIsEditModalVisible(false);
      fetchInfo();
    } catch (error) {
      message.error('Update information failed!');
      console.error('Error updating profile:', error);
    }
  };
  console.log(userInfo);
  const renderContent = () => {
    switch (selectedMenu) {
      case 'history':
        return <HistoryApply />;
      case 'cv':
        return <MyCV />;
      default:
        return (
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row align='middle'>
                  <div className={style['avatar-container']}>
                    <Avatar src={avatarSrc} size={128} icon={<UserOutlined />} />
                    <div className={style['avatar-overlay']} onClick={handleAvatarClick}>
                      <CameraOutlined className={style['camera-icon']} />
                    </div>
                  </div>
                  <div className={style['user-info']}>
                    <Title level={3} className={style['user-name']}>
                      {userInfo?.name}
                    </Title>
                    <Text className={style['user-role']}>{userInfo?.role?.name}</Text>
                    <br />
                    <Text className={style['user-email']}>{userInfo?.email}</Text>
                  </div>
                </Row>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={4} className={style['section-title']}>
                  {t('field.generalInfo')}
                </Title>

                <Row className={style['user-details']}>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('field.name')}:</Text> {userInfo?.name}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('field.gender')}:</Text> {userInfo?.gender}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('field.birthday')}:</Text> {userInfo?.dateOfBirth}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('support.phone')}:</Text> {userInfo?.phone || t('field.notSet')}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('field.location')}:</Text> {userInfo?.address}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>{t('field.skills')}: </Text>
                    {mappedSkills.length > 0 ? mappedSkills.join(', ') : t('field.noSkills')}
                  </Col>
                </Row>
                <Button type='link' icon={<EditOutlined />} className={style['edit-button']} onClick={handleEditClick}>
                  {t('btn.edit')}
                </Button>
              </Col>
            </Row>
          </Card>
        );
    }
  };

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
      <Layout className={style['profile-container']}>
        <Sider theme='light'>
          <Menu mode='inline' defaultSelectedKeys={['profile']} onClick={({ key }) => setSelectedMenu(key)}>
            <Menu.Item key='profile'>{t('field.profile')}</Menu.Item>
            <Menu.Item key='cv'>{t('field.myCV')}</Menu.Item>
            <Menu.Item key='history'>{t('field.history')}</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className={style.content}>{renderContent()}</Content>
        </Layout>
      </Layout>

      <Modal
        title={t('uploadImage')}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className={modalStyle['upload-avatar-modal']}
      >
        <div className={modalStyle['modal-content']}>
          {previewImage ? (
            <img
              src={previewImage}
              alt='Avatar Preview'
              className={modalStyle['preview-image']}
              onClick={handlePreviewClick}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <UploadOutlined className={modalStyle['upload-icon']} />
          )}
          <p className={modalStyle['modal-text']}>{previewImage ? t('btn.checkImage') : t('chooseImage')}</p>
          <Button icon={<UploadOutlined />} onClick={handleUploadClick} className={modalStyle['upload-button']} size='large' type='primary'>
            {t('uploadImageFromComputer')}
          </Button>
          <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/*' onChange={handleFileChange} />
          {previewImage && (
            <div className={modalStyle['modal-actions']}>
              <Button type='primary' className={modalStyle['confirm-button']} onClick={handleConfirmUpload}>
                Xác nhận
              </Button>
              <Button onClick={handleCancel} className={modalStyle['cancel-button']}>
                Hủy
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal visible={isImagePreviewVisible} footer={null} onCancel={handlePreviewCancel} centered className={modalStyle['full-image-modal']}>
        <img src={previewImage || ''} alt='Full Avatar Preview' style={{ width: '100%' }} />
      </Modal>

      <Modal title={t('editProfile')} visible={isEditModalVisible} onCancel={handleEditCancel} footer={null} centered>
        <Form
          layout='vertical'
          initialValues={{
            ...userInfo,
            dateOfBirth: userInfo?.dateOfBirth ? dayjs(userInfo.dateOfBirth) : null,
          }}
          onFinish={handleEditSubmit}
        >
          <Form.Item label={t('field.fullName')} name='name'>
            <Input />
          </Form.Item>
          <Form.Item label={t('field.gender')} name='gender'>
            <Select placeholder={t('field.hint.gender')}>
              <Option value='Nam'>{t('male')}</Option>
              <Option value='Nữ'>{t('female')}</Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('field.birthday')} name='dateOfBirth'>
            <DatePicker format='YYYY-MM-DD' placeholder={t('field.hint.birthday')} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('support.phone')} name='phone'>
            <Input type='number' placeholder={t('field.hint.phone')} />
          </Form.Item>
          <Form.Item label={t('field.address')} name='address'>
            <Input placeholder={t('hr.staff.hint.address')} />
          </Form.Item>
          <Form.Item label={t('field.skills')} name='skills'>
            <Select
              mode='multiple'
              allowClear
              placeholder={t('field.skillsPlaceholder')}
              value={selectedSkills}
              onChange={(values) => setSelectedSkills(values)}
            >
              {SkillsOptions.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={handleEditCancel} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default ProfileUser;
