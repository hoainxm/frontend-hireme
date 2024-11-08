import React, { useState, useEffect, HTMLAttributes, FC } from 'react';
import { Avatar, Button, Layout, Menu, Typography, Card, Row, Col, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { UserProfile } from '../auth/models';
import { getUserProfile } from './api';
import style from '../profile/profile.module.scss';
import MainLayout from '@layout/main-layout';
import { useTranslation } from 'react-i18next';
import { PageName } from '@models/enum';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
}
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const ProfileUser: FC<Props> = ({ sectionId }) => {
  const { t } = useTranslation();
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
      <Layout>
        <Sider theme='light'>
          <Menu mode='inline' defaultSelectedKeys={['1']}>
            <Menu.Item key='1'>My Profile</Menu.Item>
            <Menu.Item key='2'>My CV</Menu.Item>
            <Menu.Item key='3'>My CV</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: '#fff', padding: '0 24px' }}>
            <Title level={3}>{t('My Profile')}</Title>
          </Header>
          <Content style={{ margin: '24px', backgroundColor: '#fff', padding: '24px' }}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Row align='middle'>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div style={{ marginLeft: 16 }}>
                      <Title level={4}>Jack Adams</Title>
                      <Text>Product Designer</Text>
                      <br />
                      <Text>Los Angeles, California, USA</Text>
                    </div>
                    <Button type='link' icon={<EditOutlined />} style={{ marginLeft: 'auto' }}>
                      {t('Edit')}
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>{t('Personal information')}</Title>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t('First Name')}:</Text> Jack
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('Last Name')}:</Text> Adams
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('Email address')}:</Text> jackadams@gmail.com
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('Phone')}:</Text> (213) 555-1234
                    </Col>
                    <Col span={24}>
                      <Text strong>{t('Bio')}:</Text> Product Designer
                    </Col>
                  </Row>
                  <Button type='link' icon={<EditOutlined />} style={{ float: 'right' }}>
                    {t('Edit')}
                  </Button>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>{t('Address')}</Title>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t('Country')}:</Text> United States of America
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('City/State')}:</Text> California, USA
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('Postal Code')}:</Text> ERT 62574
                    </Col>
                    <Col span={12}>
                      <Text strong>{t('TAX ID')}:</Text> AS564178969
                    </Col>
                  </Row>
                  <Button type='link' icon={<EditOutlined />} style={{ float: 'right' }}>
                    {t('Edit')}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </MainLayout>
  );
};

export default ProfileUser;
