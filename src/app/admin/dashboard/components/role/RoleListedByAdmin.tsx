import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Role } from './model';
import { deleteRole, fetchRoleByAdmin, fetchRoleById } from './api'; // Thêm fetchRoleById
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import CTable from '@base/table';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, Loading } from '@base/index';
import dayjs from 'dayjs';
import Yes from '../../../../../common/ui/assets/images/Success.svg';
import No from '../../../../../common/ui/assets/icon/Error.svg';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import ModalCreateRoleByAdmin from './ModalCreateRoleByAdmin';

interface Props {
  id: string;
}

const RoleListedByAdmin: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const TABLE_HEADER = [t('field.numeric'), t('field.name'), t('field.status'), t('field.last_updated'), t('field.action')];

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const fetchAllRole = (page: number) => {
    setIsLoading(true);
    fetchRoleByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setRole(result);
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
    fetchAllRole(1);
  }, []);

  const showModalCreate = () => {
    setIsModalCreateOpen(true);
  };

  const handleCancelCreate = () => {
    setIsModalCreateOpen(false);
  };


  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('cfm.deleteRole.title'),
      content: t('cfm.deleteRole.content'),
      onConfirm: async () => {
        try {
          await deleteRole(id);
          Alert.success({ title: t('success.title'), content: t('success.deleted') });
          fetchAllRole(currentPage);
        } catch (error) {
          Alert.error({ title: t('error.title'), content: t('error.deleteFailed') });
        }
      },
    });
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('btn.admin.addRole')} onClick={showModalCreate} />
      </div>

      {/* Modal Create */}
      <ModalCreateRoleByAdmin fetchAllRole={fetchAllRole} currentPage={currentPage} isModalOpen={isModalCreateOpen} closeModal={handleCancelCreate} />

      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {role.length > 0 ? (
            role.map((item, index) => (
              <CTRow
                key={item._id}
                data={[
                  index + 1,
                  item.name || t('field.notSet'),
                  <img src={item.isActive ? Yes : No} alt={item.isActive ? 'True' : 'False'} width={20} height={20} />,
                  dayjs(item.updatedAt).format('HH:mm:ss DD-MM-YYYY'),

                  <div>
                    <img src={TrashIcon} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => handleDelete(item._id)} />
                  </div>,
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {role.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={totalPage} onGetData={fetchAllRole} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
    </div>
  );
};

export default RoleListedByAdmin;
