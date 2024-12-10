/** @format */

import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../../common/ui/base';
import { Role, UserProfileByAdmin } from '../../../../auth/models';
import { Image } from 'react-bootstrap';
import { NOT_SET } from '../../../../../common/utils/constants';
import { useTranslation } from 'react-i18next';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import { createUser, deleteUser, fetchUsersByAdmin, updateUser } from './api';
import Yes from '../../../../../common/ui/assets/images/Success.svg';
import No from '../../../../../common/ui/assets/icon/Error.svg';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { PremiumPlanMapping, PREMIUM_RANKING, ROLES } from '../../constants';
import dayjs from 'dayjs';
import Edit from '../../../../../common/ui/assets/icon/Edit.svg';
import { Button, Cascader, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { CompanyId } from '../../../../../app/profile/model';
import { fetchCompaniesByAdmin } from '../company/api';

import { fetchRoleByAdmin } from '../role/api';

import locationData from '../../../../jobs/components/location.json';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}
interface Ward {
  Id: string;
  Name: string;
  Level: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface City {
  Id: string;
  Name: string;
  Districts: District[];
}

const UserListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserProfileByAdmin[]>([]);
  const [role, setRole] = useState<Role[]>([]);

  const [allUsers, setAllUsers] = useState<UserProfileByAdmin[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfileByAdmin[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileByAdmin | null>(null);
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<CompanyId | null>(null);
  const [form] = Form.useForm();

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.name'),
    t('field.email'),
    t('field.role'),
    t('field.verified'),
    t('field.premium'),
    t('field.last_updated'),
    t('field.action'),
  ];

  const fetchAllRole = (page: number) => {
    setIsLoading(true);
    fetchRoleByAdmin(page, pageSize)
      .then((res) => {
        const { result } = res.data;
        setRole(result);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: t('error.title'), content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const transformLocationData = (
    data: City[]
  ): { value: string; label: string; children?: { value: string; label: string; children?: { value: string; label: string }[] }[] }[] => {
    return data.map((city) => ({
      value: city.Name,
      label: city.Name,
      // children: city.Districts.map((district) => ({
      //   value: district.Name,
      //   label: district.Name,
      //   children: district.Wards.map((ward) => ({
      //     value: ward.Name,
      //     label: ward.Name,
      //   })),
      // })),
    }));
  };

  const locationOptions = transformLocationData(locationData as City[]);

  const fetchAllUsers = (page: number) => {
    setIsLoading(true);
    fetchUsersByAdmin(page, 1000)
      .then((res) => {
        const { result } = res.data;
        setAllUsers(result);
        setFilteredUsers(result.slice(0, pageSize));
        setTotalData(result.length);
      })
      .catch((error) => {
        if (error.response?.status === 403) handleErrorNoPermission(error, t);
        else Alert.error({ title: t('error.title'), content: t('error.stWrong') });
      })
      .finally(() => setIsLoading(false));
  };

  const onSearch = (value: string) => {
    const searchValueLower = value.toLowerCase();
    setSearchValue(value); // Update search value

    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValueLower) ||
        user.email.toLowerCase().includes(searchValueLower) ||
        user.role?.toLowerCase().includes(searchValueLower)
    );

    setFilteredUsers(filtered.slice(0, pageSize));
    setTotalData(filtered.length);
    setCurrentPage(1);
  };

  const handlePaginationChange = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    setCurrentPage(page);
    setFilteredUsers(allUsers.slice(start, end));
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setPageSize(value);
    fetchAllUsers(1);
  };

  const loadAllCompanies = async () => {
    if (selectedRole === '66376960e60f6eda1161fdf2') {
      try {
        const res = await fetchCompaniesByAdmin(1, 100);
        setCompanies(res.data.result);
      } catch (error) {
        message.error(t('error.fetchCompaniesFailed'));
      }
    } else {
      setCompanies([]);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const selected = companies.find((company) => company._id === companyId);
    setSelectedCompany(selected || null);
  };

  useEffect(() => {
    loadAllCompanies();
    fetchAllRole(1);
  }, [selectedRole]);

  const handleCreateUser = async (values: any) => {
    try {
      const address = values.address ? values.address.join(' - ') : '';
      const payload: any = {
        ...values,
        address,
        dateOfBirth: dayjs(values.dateOfBirth).format('DD/MM/YYYY'),
      };

      if (selectedRole === '66376960e60f6eda1161fdf2') {
        const selectedCompany = companies.find((company) => company._id === values.companyId);
        if (!selectedCompany) {
          message.error('Error');
          return;
        }
        payload.company = {
          _id: selectedCompany._id,
          name: selectedCompany.name,
        };
      }
      console.log(payload);
      delete payload.companyId;
      await createUser(payload);
      Alert.success({ title: t('success.title'), content: t('success.userCreated') });
      fetchAllUsers(currentPage);
      setIsCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      Alert.error({ title: t('fail.title'), content: t('error.createUserFailed') });
      form.resetFields();
    }
  };

  const handleEditClick = (user: UserProfileByAdmin) => {
    setSelectedUser(user);
    form.setFieldsValue({
      ...user,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    form.resetFields();
    setSelectedUser(null);
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = async (values: any) => {
    const payload = {
      ...values,
      isPremium: values.isPremium,
      isVerify: values.isVerify,
    };
    console.log(payload);
    try {
      await updateUser(selectedUser?._id || '', payload);
      Alert.success({ title: t('success.title'), content: t('error.updateUserSuccess') });
      setIsEditModalVisible(false);
      fetchAllUsers(currentPage);
    } catch (error) {
      setIsEditModalVisible(false);
      Alert.error({ title: t('fail.title'), content: t('error.updateUserFailed') });
    }
  };

  const onDeleteUser = (userId: string) => {
    Confirm.delete({
      title: t('cfm.deleteUser.title'),
      content: t('cfm.deleteUser.content'),
      onConfirm: () => {
        deleteUser(userId)
          .then(() => {
            Alert.success({ title: t('success.title'), content: t('success.userDeleted') });
            fetchAllUsers(currentPage);
          })
          .catch(() => {
            Alert.error({ title: t('error.title'), content: t('error.stWrong') });
          });
      },
    });
  };

  const getRoleName = (roleId: string): string => {
    const role = ROLES.find((r) => r._id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  useEffect(() => {
    fetchAllUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-between mb-3'>
        <Input.Search
          placeholder={t('field.search')}
          onSearch={onSearch}
          allowClear
          enterButton
          style={{ width: 600 }}
          onChange={(e) => onSearch(e.target.value)}
        />
        {/* <CButton className='ml-2' label={t('btn.admin.addUser')} onClick={() => setIsCreateModalVisible(true)} /> */}
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <CTRow
              key={user._id}
              data={[
                index + 1 + (currentPage - 1) * pageSize,
                user.name || t('field.notSet'),
                user.email || t('field.notSet'),
                getRoleName(user.role) || t('field.notSet'),
                <Image src={user.isVerify ? Yes : No} alt={user.isVerify ? 'Verified' : 'Not Verified'} width={20} height={20} />,
                PremiumPlanMapping[user.isPremium],
                dayjs(user.updatedAt).format('HH:mm:ss DD-MM-YYYY'),
                <div className='d-flex align-items-center'>
                  {/* <Image
                    src={Edit}
                    alt='edit'
                    width={20}
                    height={20}
                    style={{ cursor: 'pointer', marginRight: 10 }}
                    onClick={() => handleEditClick(user)}
                  /> */}
                  <Image src={TrashIcon} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => onDeleteUser(user._id)} />
                </div>,
              ]}
            />
          ))}
        </tbody>
      </CTable>
      {filteredUsers.length > 0 ? (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={Math.ceil(totalData / pageSize)} onGetData={handlePaginationChange} />
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
