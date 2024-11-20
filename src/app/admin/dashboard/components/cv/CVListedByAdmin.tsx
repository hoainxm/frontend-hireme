/** @format */

import React, { FC, useState, useEffect } from 'react';
import { fetchCVs, deleteCV } from './api';
import { CV } from './model';
import { CTable, CButton, CTPaging, CTPageSize, CTRow, BlankFrame, Loading } from '../../../../../common/ui/base';
import { useTranslation } from 'react-i18next';
import { Confirm, Alert } from '../../../../../common/utils/popup';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}

const CVListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalData, setTotalData] = useState<number>(0);

  const fetchData = (page: number) => {
    setIsLoading(true);
    fetchCVs(page, pageSize)
      .then((res) => {
        setCVs(res.data.results);
        setCurrentPage(res.data.page);
        setTotalPage(Math.ceil(res.data.total / pageSize));
        setTotalData(res.data.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent'),
      onConfirm: () => {
        deleteCV(id)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.deleted') });
            fetchData(currentPage);
          })
          .catch(() => Alert.error({ title: t('error.title'), content: t('error.deleteFailed') }));
      },
    });
  };

  useEffect(() => {
    fetchData(1);
  }, [pageSize]);

  return (
    <>
      <div className='d-flex justify-content-end mb-3'>
        <CButton
          label={t('action.addCV')}
          onClick={() => {
            /* Redirect to add CV form */
          }}
        />
      </div>
      <CTable>
        <thead>
          <CTRow header data={[t('field.name'), t('field.owner'), t('field.actions')]} />
        </thead>
        <tbody>
          {cvs.length > 0 ? (
            cvs.map((cv, index) => (
              <CTRow key={index} data={[cv.name, cv.owner.name, <button onClick={() => handleDelete(cv._id)}>{t('action.delete')}</button>]} />
            ))
          ) : (
            <BlankFrame title={t('message.noData')} />
          )}
        </tbody>
      </CTable>
      <div className='d-flex justify-content-between mt-3'>
        <CTPageSize onChange={(e) => setPageSize(Number(e.target.value))} totalData={totalData} />
        <CTPaging currentPage={currentPage} totalPage={totalPage} onGetData={fetchData} />
      </div>
      <Loading isOpen={isLoading} />
    </>
  );
};

export default CVListedByAdmin;
