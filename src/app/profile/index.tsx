import React, { useState, useEffect, HTMLAttributes, FC, useRef } from 'react';
import { Avatar, Button, Layout, Menu, Typography, Card, Row, Col, Divider, Modal, message, List, Form, Input, Select, DatePicker } from 'antd';
import { UserOutlined, CameraOutlined, EditOutlined, UploadOutlined, FilePdfOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserProfile } from '../auth/models';
import { getUserProfile, uploadAvatar, uploadCV, getResumeByUser } from './api';
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

  const handleEditSubmit = async (values: any) => {};

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
                  Thông tin cá nhân
                </Title>

                <Row className={style['user-details']}>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Họ tên: </Text> {userInfo?.name}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Giới tính: </Text> {userInfo?.gender}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Ngày sinh: </Text> {userInfo?.dateOfBirth}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Điện thoại: </Text> {userInfo?.phone || 'Chưa có số điện thoại'}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Địa chỉ: </Text> {userInfo?.address}
                  </Col>
                  <Col span={12} className={style['detail-item']}>
                    <Text className={style.label}>Kỹ năng: </Text>
                    {mappedSkills.length > 0 ? mappedSkills.join(', ') : 'Chưa có kỹ năng'}
                  </Col>
                </Row>
                <Button type='link' icon={<EditOutlined />} className={style['edit-button']} onClick={handleEditClick}>
                  Chỉnh sửa
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
            <Menu.Item key='profile'>Hồ Sơ Của Tôi</Menu.Item>
            <Menu.Item key='cv'>CV Của Tôi</Menu.Item>
            <Menu.Item key='history'>Lịch Sử</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className={style.content}>{renderContent()}</Content>
        </Layout>
      </Layout>

      <Modal
        title='Tải lên Avatar'
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
          <p className={modalStyle['modal-text']}>{previewImage ? 'Nhấp vào ảnh để xem ảnh gốc' : 'Chọn một hình ảnh để làm avatar của bạn.'}</p>
          <Button icon={<UploadOutlined />} onClick={handleUploadClick} className={modalStyle['upload-button']} size='large' type='primary'>
            Chọn ảnh từ máy tính
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

      <Modal title='Chỉnh sửa thông tin cá nhân' visible={isEditModalVisible} onCancel={handleEditCancel} footer={null} centered>
        <Form
          layout='vertical'
          initialValues={{
            ...userInfo,
            dateOfBirth: userInfo?.dateOfBirth ? dayjs(userInfo.dateOfBirth) : null,
          }}
          onFinish={handleEditSubmit}
        >
          <Form.Item label='Họ tên' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='Giới tính' name='gender'>
            <Select>
              <Option value='nam'>Nam</Option>
              <Option value='nu'>Nữ</Option>
              <Option value='khong_xac_dinh'>Không xác định</Option>
            </Select>
          </Form.Item>
          <Form.Item label='Ngày sinh' name='dateOfBirth'>
            <DatePicker format='YYYY-MM-DD' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label='Điện thoại' name='phone'>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Địa chỉ' name='address'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Lưu
            </Button>
            <Button onClick={handleEditCancel} style={{ marginLeft: '8px' }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default ProfileUser;
