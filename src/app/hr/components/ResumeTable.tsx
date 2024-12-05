import React from 'react';
import { Table, Tag, Button, Image } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ResumeStatusMapping } from '../model';
import Edit from '../../../common/ui/assets/icon/Edit.svg';
import { EditOutlined } from '@ant-design/icons';

interface Props {
  resumes: Array<{
    _id: string;
    email: string;
    jobId?: { name: string };
    companyId?: { name: string };
    status: string;
    createdAt: string;
  }>;
  handleEditClick: (resume: any) => void;
}

const ResumeTable: React.FC<Props> = ({ resumes, handleEditClick }) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('field.numeric'),
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => <strong>{index + 1}</strong>,
    },
    {
      title: t('field.email'),
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    {
      title: t('field.jobName'),
      dataIndex: ['jobId', 'name'],
      key: 'jobName',
      render: (jobName: string) => jobName || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    // {
    //   title: t('field.companyName'),
    //   dataIndex: ['companyId', 'name'],
    //   key: 'companyName',
    //   render: (companyName: string) => companyName || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    // },
    {
      title: t('field.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    {
      title: t('field.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') : <Tag color='volcano'>{t('field.notSet')}</Tag>),
    },
    {
      title: t('field.action'),
      key: 'action',
      render: (_: any, record: any) => (
        <Button className='icon-action' style={{ cursor: 'pointer' }} onClick={() => handleEditClick(record)} icon={<EditOutlined />} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={resumes}
      rowKey='_id'
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
      }}
      bordered
      locale={{
        emptyText: t('field.hint.noData'),
      }}
    />
  );
};

export default ResumeTable;
