/** @format */

import React, { FC, useState, useEffect } from 'react';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../../../common/ui/base';
import { Confirm, Alert } from '../../../../../common/utils/popup';
import { fetchCVsByAdmin, deleteCV } from './api'; // Replace with the actual API functions
import { CV } from './model'; // Replace with the actual CV model
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageURL } from '../../../../../models/enum';
import { Image } from 'react-bootstrap';
import dayjs from 'dayjs';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';

interface Props {
  id: string;
}

const CVListedByAdmin: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.email'), t('field.status'), t('field.last_updated')];

  const fetchCVs = (page: number) => {
    setIsLoading(true);
    fetchCVsByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setCVs(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleDelete = (cvId: string) => {
    Confirm.delete({
      title: t('confirm.deleteTitle'),
      content: t('confirm.deleteContent'),
      onConfirm: () => {
        deleteCV(cvId)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.deleted') });
            fetchCVs(currentPage);
          })
          .catch(() => Alert.error({ title: t('error.title'), content: t('error.deleteFailed') }));
      },
    });
  };

  useEffect(() => {
    fetchCVs(1); // Initial fetch
  }, [pageSize]);

  return (
    <div>
      {/* <div className='d-flex justify-content-end mb-3'>
        <CButton label={t('btn.admin.addCV')} onClick={() => history.push(`${PageURL.ADMIN_MANAGE_CV}/create`)} />
      </div> */}
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {cvs.length > 0 ? (
            cvs.map((cv, index) => (
              <CTRow
                key={cv._id}
                data={[
                  index + 1,
                  cv.email || t('field.notSet'),
                  cv.status || t('field.notSet'),
                  dayjs(cv.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                  // <Image src={TrashIcon} alt='Delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => handleDelete(cv._id)} />,
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {cvs.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchCVs} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default CVListedByAdmin;
