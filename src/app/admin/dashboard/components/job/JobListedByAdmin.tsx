/** @format */

import React, { FC, useEffect, useState } from 'react';
import { CButton, CTPaging, CTPageSize, CTRow, CTable, BlankFrame, Loading } from '../../../../../common/ui/base';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { fetchJobs, deleteJob } from './api';
import { Job } from '../../../../jobs/model';
import { PageURL } from '../../../../../models/enum';
import { handleErrorNoPermission } from '../../../../../common/utils/common';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}

const JobListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
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
    fetchJobs(page, pageSize)
      .then((res) => {
        setJobs(res.data.results);
        setCurrentPage(res.data.page);
        setTotalPage(Math.ceil(res.data.total / res.data.page_size));
        setTotalData(res.data.total);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: 'Oops!', content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const checkValidPageAfterDelete = () => {
    if (jobs.length === 1) {
      return currentPage > 1 ? currentPage - 1 : 1;
    }
    return currentPage;
  };

  const onDeleteJob = (jobId: string) => {
    Confirm.delete({
      title: t('cfm.deleteJob.title'),
      content: t('cfm.deleteJob.content'),
      onConfirm: () => {
        deleteJob(jobId)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.jobDeleted') });
            fetchAllJobs(checkValidPageAfterDelete());
          })
          .catch((error) => {
            Alert.error({ title: 'Oops!', content: t('error.stWrong') });
          });
      },
    });
  };

  useEffect(() => {
    fetchAllJobs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('admin.addJob')} onClick={() => history.push(`${PageURL.ADMIN_MANAGE_JOB}/create`)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <CTRow
              key={job._id}
              data={[
                index + 1,
                job.name,
                job.company?.name || '-',
                job.location || '-',
                `${job.salary.toLocaleString()} VND`,
                job.startDate,
                job.endDate,
                <CButton label={t('action.delete')} onClick={() => onDeleteJob(job._id)} className='btn-danger' />,
              ]}
              onClick={() => history.push(`${PageURL.ADMIN_MANAGE_JOB}/update/${job._id}`)}
            />
          ))}
        </tbody>
      </CTable>
      {jobs.length > 0 ? (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllJobs} />
          </div>
        </div>
      ) : (
        <BlankFrame className='blank-frame' title={t('field.hint.no_data')} />
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default JobListedByAdmin;
