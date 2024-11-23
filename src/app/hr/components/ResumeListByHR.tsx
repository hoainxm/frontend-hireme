/** @format */

import React, { FC, useEffect, useState } from 'react';
import { fetchResumesByHR } from '../api';
import { Resume } from '../model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../common/ui/base';
import { Alert } from '../.././../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
}
const ResumeListByHR: FC<Props> = () => {
  const { t } = useTranslation();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.email'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.status'),
    t('field.submissionTime'),
  ];

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchResumesByHR(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setResumes(result);
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
          {resumes.length > 0 ? (
            resumes.map((resume, index) => (
              <CTRow
                key={resume._id}
                data={[
                  index + 1,
                  resume.email || t('field.notSet'),
                  resume.jobId?.name || t('field.notSet'),
                  resume.companyId?.name || t('field.notSet'),
                  t(`status.${resume.status.toLowerCase()}`),
                  dayjs(resume.createdAt).format('YYYY-MM-DD HH:mm:ss') || t('field.notSet'),
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {resumes.length > 0 && (
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

export default ResumeListByHR;
