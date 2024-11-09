import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Tag, Button, Collapse, Space, Divider, Timeline, Badge } from 'antd';
import { getResumeByUser } from './api';
import { Resume } from './model';
import { FileTextOutlined, DownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './historyApply.module.scss';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const HistoryApply = () => {
  const [data, setData] = useState<Resume[]>([]);

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
        Lịch sử ứng tuyển
      </Title>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id} className={styles['history-apply__list-item']}>
            <Card
              className={`${styles['history-apply__card']} ${
                item.status === 'PENDING'
                  ? styles['history-apply__card--status-pending']
                  : item.status === 'REJECTED'
                  ? styles['history-apply__card--status-rejected']
                  : styles['history-apply__card--status-approved']
              } ${styles['history-apply__card__body']}`}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <div className={styles['history-apply__card__header']}>
                  <div>
                    <Title level={4} className={styles['history-apply__card__job-title']}>
                      {item.jobId.name}
                    </Title>
                    <Text className={styles['history-apply__card__company']}>Công ty: {item.companyId.name}</Text>
                  </div>
                  <Button
                    type='primary'
                    shape='round'
                    icon={<FileTextOutlined />}
                    onClick={() => window.open(`${process.env.REACT_APP_API_URL}/images/resume/${item.url}`, '_blank')}
                    className={styles['history-apply__btn-view-cv']}
                  >
                    Xem CV
                  </Button>
                </div>

                <Divider />

                <Badge.Ribbon text={item.status} color={item.status === 'PENDING' ? 'blue' : item.status === 'REJECTED' ? 'red' : 'green'}>
                  <Text className={styles['history-apply__card__status']}>
                    <strong style={{ marginRight: '5px' }}>Trạng thái hiện tại: </strong>
                    <Tag color={item.status === 'PENDING' ? 'blue' : item.status === 'REJECTED' ? 'red' : 'green'}>{item.status}</Tag>
                  </Text>
                </Badge.Ribbon>

                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                  className={styles['history-apply__collapse']}
                >
                  <Panel header='Xem chi tiết lịch sử' key='1' className={styles['history-apply__collapse-header']}>
                    <Timeline mode='left' className={styles['history-apply__timeline']}>
                      {item.history.map((historyItem, index) => (
                        <Timeline.Item
                          key={index}
                          color={historyItem.status === 'PENDING' ? 'blue' : historyItem.status === 'REJECTED' ? 'red' : 'green'}
                          dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                        >
                          <Text className={styles['history-apply__timeline-item-time']} style={{ marginRight: '10px' }}>
                            {new Date(historyItem.updatedAt).toLocaleString()}
                          </Text>
                          <Tag color={historyItem.status === 'PENDING' ? 'blue' : historyItem.status === 'REJECTED' ? 'red' : 'green'}>
                            {historyItem.status}
                          </Tag>
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
