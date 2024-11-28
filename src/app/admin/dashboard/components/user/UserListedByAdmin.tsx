/** @format */

import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Alert, Confirm } from '../../../../../common/utils/popup';
import { BlankFrame, CButton, CTPageSize, CTPaging, CTRow, CTable, Loading } from '../../../../../common/ui/base';
import { Role, UserProfile, UserProfileByAdmin } from '../../../../auth/models';
import { APIResponse } from '../../../../../common/utils/baseAPI';
import { Image } from 'react-bootstrap';
import { NOT_SET } from '../../../../../common/utils/constants';
import { PageURL, ScopeValue } from '../../../../../models/enum';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { handleErrorNoPermission } from '../../../../../common/utils/common';
import { createUser, deleteUser, fetchUsersByAdmin } from './api';
import Yes from '../../../../../common/ui/assets/images/Success.svg';
import No from '../../../../../common/ui/assets/icon/Error.svg';
import TrashIcon from '../../../../../common/ui/assets/ic/20px/trash-bin.svg';
import { PremiumPlanMapping, PREMIUM_RANKING, ROLES } from '../../constants';
import dayjs from 'dayjs';
import Edit from '../../../../../common/ui/assets/icon/Edit.svg';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { getAllCompanies } from '../../../../company/api';
import { updateUserProfile } from 'app/profile/api';
import { useForm } from 'antd/es/form/Form';

interface Props {
  // isSysAdminSite?: boolean;
  id: string;
}

const UserListedByAdmin: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
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
  const [form] = Form.useForm();
  // const [companies, setCompanies] = useState<{ _id: string; name: string }[]>([]);
  // const [selectedRole, setSelectedRole] = useState<string | undefined>(selectedUser?.role);
  // const [selectedCompany, setSelectedCompany] = useState<string | undefined>(selectedUser?.companyId || '');

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

  console.log('selectedUser', selectedUser);

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
    try {
      const res = await getAllCompanies(1, 100);
      setCompanies(res.data.result);
    } catch (error) {
      message.error(t('error.fetchCompaniesFailed'));
    }
  };

  const handleCreateUser = async (values: any) => {
    try {
      const payload: any = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format('DD/MM/YYYY'),
      };

      if (selectedRole === '66376960e60f6eda1161fdf2') {
        const selectedCompany = companies.find((company) => company._id === values.companyId);
        if (!selectedCompany) {
          message.error('Công ty không hợp lệ');
          return;
        }

        payload.company = {
          _id: selectedCompany._id,
          name: selectedCompany.name,
        };
      }

      await createUser(payload);
      Alert.success({ title: t('success.title'), content: t('success.userCreated') });
      fetchAllUsers(currentPage);
      setIsCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      Alert.error({ title: t('fail.title'), content: t('error.createUserFailed') });
    }
  };

  const checkValidPageAfterDelete = () => {
    if (users.length === 1) {
      return currentPage > 1 ? currentPage - 1 : 1;
    }
    return currentPage;
  };

  const handleEditClick = (user: UserProfileByAdmin) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setSelectedUser(null);
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = async (values: any) => {
    // const payload = {
    //   ...values,
    //   companyId: selectedRole === 'HR' ? selectedCompany : undefined,
    // };
    // try {
    //   await updateUserProfile(selectedUser?._id || '', payload);
    //   message.success('Thông tin đã được cập nhật thành công!');
    //   setIsEditModalVisible(false);
    //   fetchAllUsers(currentPage);
    // } catch (error) {
    //   message.error('Cập nhật thất bại!');
    // }
  };

  const onDeleteUser = (userId: string) => {
    Confirm.delete({
      title: t('cfm.deleteUser.title'),
      content: t('cfm.deleteUser.content'),
      onConfirm: () => {
        deleteUser(userId)
          .then(() => {
            // message.success(t('success.userDeleted'));
            Alert.success({ title: t('success.title'), content: t('success.userDeleted') });
            fetchAllUsers(currentPage);
            // fetchAllUsers(checkValidPageAfterDelete());
          })
          .catch(() => {
            Alert.error({ title: 'Oops!', content: t('error.stWrong') });
          });
      },
    });
  };

  // useEffect(() => {
  //   if (selectedRole === 'HR') {
  //     getAllCompanies(1, 100)
  //       .then((res) => {
  //         if (Array.isArray(res.data)) {
  //           setCompanies(res.data);
  //         } else {
  //           setCompanies([]);
  //           console.error('API response is not an array:', res.data);
  //         }
  //       })
  //       .catch(() => {
  //         setCompanies([]);
  //         Alert.error({ title: 'Oops!', content: 'Không thể tải danh sách công ty!' });
  //       });
  //   }
  // }, [selectedRole]);

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

      {/*  Modal update thong tin */}
      <Modal title={t('btn.admin.addUser')} visible={isCreateModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null} centered>
        <Form layout='vertical' onFinish={handleCreateUser}>
          <Form.Item label={t('field.fullName')} name='name' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.email')} name='email' rules={[{ required: true, type: 'email', message: t('field.invalidEmail') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.password')} name='password' rules={[{ required: true, message: t('field.required') }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label={t('field.gender')} name='gender' rules={[{ required: true, message: t('field.required') }]}>
            <Select>
              <Select.Option value='male'>{t('field.male')}</Select.Option>
              <Select.Option value='female'>{t('field.female')}</Select.Option>
              <Select.Option value='other'>{t('field.other')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={t('field.address')} name='address' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.role')} name='role' rules={[{ required: true, message: t('field.required') }]}>
            <Select
              onChange={(value) => setSelectedRole(value)} // Cập nhật trạng thái
            >
              {ROLES.map((role) => (
                <Select.Option key={role._id} value={role._id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRole === '66376960e60f6eda1161fdf2' && (
            <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.required') }]}>
              <Select placeholder={t('field.selectCompany')}>
                {companies.map((company) => (
                  <Select.Option key={company._id} value={company._id}>
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Công ty */}
          {/* <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.required') }]}>
            <Select placeholder={t('field.selectCompany')}>
              {companies.map((company) => (
                <Select.Option key={company._id} value={company._id}>
                  {company.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item label={t('support.phone')} name='phone' rules={[{ required: true, message: t('field.required') }]}>
            <Input />
          </Form.Item>

          <Form.Item label={t('field.birthday')} name='dateOfBirth' rules={[{ required: true, message: t('field.required') }]}>
            <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
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
          {/* Họ tên */}
          <Form.Item label={t('field.fullName')} name='name'>
            <Input disabled />
          </Form.Item>
          {/* Email */}
          <Form.Item label={t('field.email')} name='email'>
            <Input disabled />
          </Form.Item>
          {/* Vai trò */}
          {/* <Form.Item label={t('field.role')} name='role'>
            <Select
              onChange={(value) => {
                setSelectedRole(value);
              }}
            >
              {ROLES.map((role: Role) => (
                <Select.Option key={role._id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          {/* {selectedRole === 'HR' && (
            <Form.Item label={t('field.company')} name='companyId' rules={[{ required: true, message: t('field.required') }]}>
              <Select placeholder={t('field.selectCompany')} onChange={(value) => setSelectedCompany(value)}>
                {companies.map((company) => (
                  <Select.Option key={company._id} value={company._id}>
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )} */}
          {/* Ngày sinh */}
          <Form.Item label={t('field.birthday')} name='dateOfBirth'>
            <DatePicker format='YYYY-MM-DD' placeholder={t('field.hint.birthday')} style={{ width: '100%' }} />
          </Form.Item>
          {/* Địa chỉ */}
          <Form.Item label={t('field.address')} name='address'>
            <Input />
          </Form.Item>
          {/* Premium */}
          <Form.Item label={t('field.premium')} name='isPremium'>
            <Input disabled />
          </Form.Item>
          {/* Xác thực */}
          <Form.Item label={t('field.verified')} name='isVerify'>
            <Input disabled />
          </Form.Item>
          {/* Ngày tạo */}
          <Form.Item label={t('field.createdAt')} name='createdAt'>
            <Input disabled value={dayjs(selectedUser?.createdAt).format('YYYY-MM-DD HH:mm:ss')} />
          </Form.Item>
          {/* Lần cập nhật cuối */}
          <Form.Item label={t('field.last_updated')} name='updatedAt'>
            <Input disabled value={dayjs(selectedUser?.updatedAt).format('YYYY-MM-DD HH:mm:ss')} />
          </Form.Item>
          {/* Nút Lưu và Hủy */}
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
