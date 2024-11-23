/** @format */

import React, { FC, useEffect, useState } from 'react';
import { fetchJobsByHR } from '../api';
import { Job } from '../../jobs/model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../common/ui/base';
import { Alert } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
}

const JobListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.lastUpdated'),
  ];

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchJobsByHR(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setJobs(result);
        setCurrentPage(meta.current);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchData(1);
  }, [pageSize]);

  return (
    <div>
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
                  job.name || t('field.notSet'),
                  job.company.name || t('field.notSet'),
                  job.location || t('field.notSet'),
                  `${job.salary.toLocaleString()} VND` || t('field.notSet'),
                  dayjs(job.updatedAt).format('YYYY-MM-DD HH:mm:ss') || t('field.notSet'),
                ]}
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
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={Math.ceil(totalData / pageSize)} onGetData={fetchData} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default JobListByHR;
