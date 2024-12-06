import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Permission } from './model';
import { Alert } from '../../../../../common/utils/popup';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import { fetchPermissionByAdmin } from './api';
import { BlankFrame, CButton, CTable, CTPageSize, CTPaging, CTRow, Loading } from '@base/index';
import dayjs from 'dayjs';
import Edit from '../../../../../common/ui/assets/icon/Edit.svg';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';

interface Props {
  id: string;
}

const PermissionListedByAdmin: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const [permission, setPermission] = useState<Permission[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.id'), t('field.name'), t('filed.api'), t('filed.method'), t('field.module')];

  const fetchAllPermission = (page: number) => {
    setIsLoading(true);
    fetchPermissionByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setPermission(result);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: t('error.title'), content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAllPermission(1);
  }, []);

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {permission.length > 0 ? (
            permission.map((item, index) => (
              <CTRow key={item._id} data={[index + 1, item._id, item.name || t('field.notSet'), item.apiPath, item.method, item.module]} />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {permission.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllPermission} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default PermissionListedByAdmin;
