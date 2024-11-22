/** @format */

import React, { FC, useEffect, useState } from 'react';
import { CButton, CTPaging, CTPageSize, CTRow, CTable, BlankFrame, Loading } from '../../../../../common/ui/base';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchJobsByAdmin, deleteJob } from './api';
import { Job } from '../../../../jobs/model';
import { PageURL } from '../../../../../models/enum';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import dayjs from 'dayjs';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { Image } from 'react-bootstrap';

interface Props {
  id: string;
}

const JobListedByAdmin: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.name'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.startDate'),
    t('field.endDate'),
    t('field.action'),
  ];

  const fetchAllJobs = (page: number) => {
    setIsLoading(true);
    fetchJobsByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setJobs(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteJob'),
      content: t('confirm.deleteJobContent'),
      onConfirm: () => {
        deleteJob(id)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.jobDeleted') });
            fetchAllJobs(currentPage);
          })
          .catch(() => Alert.error({ title: 'Oops!', content: t('error.stWrong') }));
      },
    });
  };

  useEffect(() => {
    fetchAllJobs(1);
    // eslint-disable-next-line
  }, [pageSize]);

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('btn.admin.addJob')} onClick={() => history.push(`${PageURL.ADMIN_MANAGE_JOB}/create`)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <CTRow
                key={job._id}
                data={[
                  index + 1,
                  job.name,
                  job.company?.name || t('field.notSet'),
                  job.location || t('field.notSet'),
                  `${job.salary.toLocaleString()} VND`,
                  dayjs(job.startDate).format('DD-MM-YYYY'),
                  dayjs(job.endDate).format('DD-MM-YYYY'),
                  <Image src={TrashIcon} alt={t('action.delete')} className='icon-action ml-3' onClick={() => handleDelete(job._id)} />,
                ]}
                onClick={() => history.push(`${PageURL.ADMIN_MANAGE_JOB}/update/${job._id}`)}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {jobs.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllJobs} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default JobListedByAdmin;
