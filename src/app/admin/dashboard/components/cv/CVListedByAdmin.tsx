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
import { Input } from 'antd';

interface Props {
  id: string;
}

const CVListedByAdmin: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [filteredCVs, setFilteredCVs] = useState<CV[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.email'), t('field.status'), t('field.last_updated'), t('field.action')];

  const fetchCVs = (page: number) => {
    setIsLoading(true);
    fetchCVsByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setCVs(result);
        setFilteredCVs(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value) {
      setFilteredCVs(cvs);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = cvs.filter((cv) => cv.email.toLowerCase().includes(lowerValue) || (cv.status && cv.status.toLowerCase().includes(lowerValue)));

    setFilteredCVs(filtered);
  };

  const onSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    const filtered = cvs.filter((cv) => cv.email.toLowerCase().includes(searchValue) || cv.status.toLowerCase().includes(searchValue));
    setFilteredCVs(filtered.slice(0, pageSize));
    setTotalData(filtered.length);
    setCurrentPage(1);
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleDelete = (cvId: string) => {
    console.log(cvId);
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
    fetchCVs(1);
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-between mb-3'>
        <Input.Search
          placeholder={t('field.search')}
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ marginBottom: '16px', maxWidth: '600px' }}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {filteredCVs.length > 0 ? (
            filteredCVs.map((cv, index) => (
              <CTRow
                key={cv._id}
                data={[
                  index + 1 + (currentPage - 1) * pageSize,
                  cv.email || t('field.notSet'),
                  cv.status || t('field.notSet'),
                  dayjs(cv.createdAt).format('HH:mm:ss DD-MM-YYYY'),
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
