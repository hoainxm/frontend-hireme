import React, { FC } from 'react';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface Props {
  jobs: Array<{
    _id: string;
    name: string;
    company: { name: string };
    location: string;
    salary: number;
    updatedAt: string;
  }>;
}

const JobTable: FC<Props> = ({ jobs }) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('field.numeric'),
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => <strong>{index + 1}</strong>,
    },
    {
      title: t('field.jobName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => name || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    {
      title: t('field.companyName'),
      dataIndex: ['company', 'name'],
      key: 'companyName',
      render: (companyName: string) => companyName || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    {
      title: t('field.location'),
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => location || <Tag color='volcano'>{t('field.notSet')}</Tag>,
    },
    {
      title: t('field.salary'),
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => (salary ? `${salary.toLocaleString()} VND` : <Tag color='volcano'>{t('field.notSet')}</Tag>),
    },
    {
      title: t('field.last_updated'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => (updatedAt ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : <Tag color='volcano'>{t('field.notSet')}</Tag>),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={jobs}
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

export default JobTable;
