/** @format */

import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../../common/ui/base';
import { fetchUsers, deleteUser } from './api'; // Ensure these APIs exist and are imported correctly
import { UserProfile } from '../../../../auth/models'; // Define your User model accordingly
import { APIResponse } from '../../../../../common/utils/baseAPI';
import { Image } from 'react-bootstrap';
import Trash from '../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { NOT_SET } from '../../../../../common/utils/constants';
import { PageURL } from '../../../../../models/enum';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { handleErrorNoPermission } from '../../../../../common/utils/common';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}

const UserListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalData, setTotalData] = useState<number>(0);

  const TABLE_HEADER = [t('field.numeric'), t('field.name'), t('field.email'), t('field.verified')];

  const fetchAllUsers = (page: number) => {
    setIsLoading(true);
    fetchUsers(page, pageSize)
      .then((res) => {
        setUsers(res.data.results);
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
    if (users.length === 1) {
      return currentPage > 1 ? currentPage - 1 : 1;
    }
    return currentPage;
  };

  const onDeleteUser = (userId: string) => {
    Confirm.delete({
      title: t('cfm.deleteUser.title'),
      content: t('cfm.deleteUser.content'),
      onConfirm: () => {
        deleteUser(userId)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.userDeleted') });
            fetchAllUsers(checkValidPageAfterDelete());
          })
          .catch(() => {
            Alert.error({ title: 'Oops!', content: t('error.stWrong') });
          });
      },
    });
  };

  useEffect(() => {
    fetchAllUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('btn.admin.addUser')} onClick={() => history.push(`${PageURL.ADMIN_MANAGE_USER}/create`)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {users.map((user, index) => (
            <CTRow
              key={user._id}
              data={[
                index + 1,
                user.name || '-',
                user.email || '-',
                user.role?.name || '-',
                user.isVerify ? t('field.verified') : t('field.unverified'),
                <CButton label={t('action.delete')} onClick={() => onDeleteUser(user._id)} className='btn-danger' />,
              ]}
              onClick={() => history.push(`${PageURL.ADMIN_MANAGE_USER}/update/${user._id}`)}
            />
          ))}
        </tbody>
      </CTable>
      {users.length > 0 ? (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllUsers} />
          </div>
        </div>
      ) : (
        <BlankFrame className='blank-frame' title={t('field.hint.no_data')} />
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default UserListedByAdmin;
