/** @format */

import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../../common/ui/base';
import { Role, UserProfileByAdmin } from '../../../../auth/models';
import { APIResponse } from '../../../../../common/utils/baseAPI';
import { Image } from 'react-bootstrap';
import { NOT_SET } from '../../../../../common/utils/constants';
import { PageURL, ScopeValue } from '../../../../../models/enum';
import { useHistory } from 'react-router-dom';
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
import locationData from '../../../../jobs/components/location.json';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
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

  const transformLocationData = (
    data: City[]
  ): { value: string; label: string; children?: { value: string; label: string; children?: { value: string; label: string }[] }[] }[] => {
    return data.map((city) => ({
      value: city.Name,
      label: city.Name,
      children: city.Districts.map((district) => ({
        value: district.Name,
        label: district.Name,
        children: district.Wards.map((ward) => ({
          value: ward.Name,
          label: ward.Name,
        })),
      })),
    }));
  };

  const locationOptions = transformLocationData(locationData as City[]);

  const fetchAllUsers = (page: number) => {
    setIsLoading(true);
    fetchUsersByAdmin(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        const usersWithRoleNames = res.data.result.map((user) => ({
          ...user,
          role: ROLES.find((role) => role._id === user.role)?.name || '-',
        }));
        setUsers(res.data.result);
        setUsers(usersWithRoleNames);
        setCurrentPage(meta.current);
        setTotalPage(meta.pages);
        setTotalData(meta.total);
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
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setSelectedUser(null);
    setIsEditModalVisible(false);
    form.resetFields();
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
      message.success('Thông tin đã được cập nhật thành công!');
      setIsEditModalVisible(false);
      fetchAllUsers(currentPage);
    } catch (error) {
      message.error('Cập nhật thất bại!');
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

  useEffect(() => {
    fetchAllUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton className='ml-2' label={t('btn.admin.addUser')} onClick={() => setIsCreateModalVisible(true)} />
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
                user.name || t('field.notSet'),
                user.email || t('field.notSet'),
                user.role || t('field.notSet'),
                <Image src={user.isVerify ? Yes : No} alt={user.isVerify ? 'Verified' : 'Not Verified'} width={20} height={20} />,
                PremiumPlanMapping[user.isPremium],
                dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                <div className='d-flex align-items-center'>
                  <Image
                    src={Edit}
                    alt='edit'
                    width={20}
                    height={20}
                    style={{ cursor: 'pointer', marginRight: 10 }}
                    onClick={() => handleEditClick(user)}
                  />
                  <Image src={TrashIcon} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => onDeleteUser(user._id)} />
                </div>,
              ]}
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

      <Modal title={t('btn.admin.addUser')} visible={isCreateModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null} centered>
        <Form layout='vertical' onFinish={handleCreateUser}>
          <Form.Item label={t('field.fullName')} name='name' rules={[{ required: true, message: t('field.error.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.email')} name='email' rules={[{ required: true, type: 'email', message: t('field.error.email') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.password')} name='password' rules={[{ required: true, message: t('field.error.required') }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.error.required') }]}>
            <Select>
              <Select.Option value='Nam'>{t('field.male')}</Select.Option>
              <Select.Option value='Nữ'>{t('field.female')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={t('field.address')} name='address' rules={[{ required: true, message: t('field.error.required') }]}>
            <Cascader options={locationOptions} />
          </Form.Item>

          <Form.Item label={t('field.role')} name='role' rules={[{ required: true, message: t('field.error.required') }]}>
            <Select onChange={(value) => setSelectedRole(value)}>
              {ROLES.map((role) => (
                <Select.Option key={role._id} value={role._id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRole === '66376960e60f6eda1161fdf2' && (
            <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.error.required') }]}>
              <Select placeholder={t('field.selectCompany')} onChange={handleCompanyChange}>
                {companies.map((company) => (
                  <Select.Option key={company._id} value={company._id}>
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item label={t('support.phone')} name='phone' rules={[{ required: true, message: t('field.error.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.birthday')} name='dateOfBirth' rules={[{ required: true, message: t('field.error.required') }]}>
            <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={() => setIsCreateModalVisible(false)} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={t('editProfile')} visible={isEditModalVisible} onCancel={handleEditCancel} footer={null} centered>
        <Form
          layout='vertical'
          initialValues={{
            ...selectedUser,
            role: selectedUser?.role,
            dateOfBirth: selectedUser?.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null,
          }}
          onFinish={handleEditSubmit}
        >
          <Form.Item label={t('field.fullName')} name='name'>
            <Input disabled />
          </Form.Item>

          <Form.Item label={t('field.email')} name='email'>
            <Input disabled />
          </Form.Item>

          <Form.Item label={t('field.premium')} name='isPremium' rules={[{ required: true }]}>
            <Select>
              {Object.keys(PremiumPlanMapping).map((key) => (
                <Select.Option key={key} value={key}>
                  {PremiumPlanMapping[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t('field.verified')} name='isVerify' rules={[{ required: true }]}>
            <Select>
              <Select.Option value={true}>{t('field.verified')}</Select.Option>
              <Select.Option value={false}>{t('field.unverified')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={t('field.createdAt')} name='createdAt'>
            <Input disabled value={dayjs(selectedUser?.createdAt).format('YYYY-MM-DD HH:mm:ss')} />
          </Form.Item>

          <Form.Item label={t('field.last_updated')} name='updatedAt'>
            <Input disabled value={dayjs(selectedUser?.updatedAt).format('YYYY-MM-DD HH:mm:ss')} />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {t('btn.save')}
            </Button>
            <Button onClick={handleEditCancel} style={{ marginLeft: '8px' }}>
              {t('btn.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListedByAdmin;
