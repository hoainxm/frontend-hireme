import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Tag, Button, Collapse, Space, Divider, Timeline, Badge } from 'antd';
import { getResumeByUser } from './api';
import { Resume } from './model';
import { FileTextOutlined, DownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './historyApply.module.scss';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'blue';
    case 'REVIEW':
      return 'orange';
    case 'APPROVED':
      return 'green';
    case 'REJECTED':
      return 'red';
    default:
      return 'gray';
  }
};

const HistoryApply = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Resume[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchResume = async () => {
    try {
      const res = await getResumeByUser();
      if (res && res.data) setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  return (
    <div className={styles['history-apply']}>
      <Title level={3} className={styles['history-apply__title']}>
        {t('historyApplied')}
      </Title>
      <List
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }}
        renderItem={(item) => (
          <List.Item key={item._id} className={styles['history-apply__list-item']}>
            <Card className={`${styles['history-apply__card']} ${styles[`history-apply__card--status-${item.status.toLowerCase()}`]}`}>
              <Space direction='vertical' style={{ width: '100%' }}>
                <div className={styles['history-apply__card__header']}>
                  <div>
                    <Title level={4} className={styles['history-apply__card__job-title']}>
                      {item.jobId.name}
                    </Title>
                    <Text className={styles['history-apply__card__company']}>
                      {t('field.company')}: {item.companyId.name}
                    </Text>
                  </div>
                  <Button
                    type='primary'
                    shape='round'
                    icon={<FileTextOutlined />}
                    onClick={() => window.open(`${process.env.REACT_APP_API_URL}/images/resume/${item.url}`, '_blank')}
                    className={styles['history-apply__btn-view-cv']}
                  >
                    {t('btn.viewDetails')}
                  </Button>
                </div>

                <Divider />

                <Badge.Ribbon text={item.status} color={getStatusColor(item.status)}>
                  <Text className={styles['history-apply__card__status']}>
                    <strong style={{ marginRight: '5px' }}>{t('field.status')}: </strong>
                    <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                  </Text>
                </Badge.Ribbon>

                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                  className={styles['history-apply__collapse']}
                >
                  <Panel header={t('historyApplied')} key='1' className={styles['history-apply__collapse-header']}>
                    <Timeline mode='left' className={styles['history-apply__timeline']}>
                      {item.history.map((historyItem, index) => (
                        <Timeline.Item
                          key={index}
                          color={getStatusColor(historyItem.status)}
                          dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                        >
                          <Text className={styles['history-apply__timeline-item-time']} style={{ marginRight: '10px' }}>
                            {new Date(historyItem.updatedAt).toLocaleString()}
                          </Text>
                          <Tag color={getStatusColor(historyItem.status)}>{historyItem.status}</Tag>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Panel>
                </Collapse>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default HistoryApply;
