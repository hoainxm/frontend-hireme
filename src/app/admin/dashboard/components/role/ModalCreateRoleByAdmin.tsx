import React from 'react';
import { Modal, Form, Input, Switch, Collapse } from 'antd';
import { createRole } from './api';

const { Panel } = Collapse;

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  fetchAllRole: (currentPage: number) => void;
  currentPage: number;
}

interface PermissionIds {
  RESUMES: string[];
  JOBS: string[];
  ROLES: string[];
  FILES: string[];
  COMPANIES: string[];
  USERS: string[];
  PERMISSIONS: string[];
  SUBSCRIBERS: string[];
}

const permissions: PermissionIds = {
  RESUMES: [
    '648ad4fedafdb9754f40b863',
    '648ad511dafdb9754f40b868',
    '648ad522dafdb9754f40b86d',
    '648ad53bdafdb9754f40b872',
    '648ad56ddafdb9754f40b87c',
    '648ad555dafdb9754f40b877',
  ],
  JOBS: ['648ad488dafdb9754f40b846', '648ad4a6dafdb9754f40b850', '648ad4d9dafdb9754f40b85e', '648ad499dafdb9754f40b84b', '648ad4ccdafdb9754f40b859'],
  ROLES: ['648ad622dafdb9754f40b89f', '648ad613dafdb9754f40b89a', '648ad650dafdb9754f40b8b0', '648ad640dafdb9754f40b8ab', '648ad630dafdb9754f40b8a6'],
  FILES: ['648ab750fa16b294212e404c'],
  COMPANIES: [
    '648ab436f4328bd3153ee216',
    '648ab415f4328bd3153ee211',
    '648ab4d5f4328bd3153ee21b',
    '648ab4ebf4328bd3153ee220',
    '648ab5a8072f2a2ef910638d',
  ],
  USERS: ['648ab6d3fa16b294212e4033', '648ab728fa16b294212e4047', '648ab6e7fa16b294212e4038', '648ab719fa16b294212e4042', '648ab6fdfa16b294212e403d'],
  PERMISSIONS: [
    '648ad5ebdafdb9754f40b895',
    '648ad5aedafdb9754f40b886',
    '648ad5d4dafdb9754f40b890',
    '648ad5c5dafdb9754f40b88b',
    '648ad59adafdb9754f40b881',
  ],
  SUBSCRIBERS: [
    '668ebc774194643bd6db31d6',
    '668ebca34194643bd6db31e7',
    '668ebcb84194643bd6db31f0',
    '668ebd434194643bd6db320d',
    '668ec08d4194643bd6db32a4',
  ],
};

const ModalCreateRoleByAdmin: React.FC<Props> = ({ isModalOpen, closeModal, fetchAllRole, currentPage }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const activePermissions = (Object.keys(permissions) as (keyof PermissionIds)[])
          .filter((key) => values[`permission_${key}`])
          .flatMap((key) => permissions[key]);

        const payload = {
          name: values.roleName,
          description: values.description,
          isActive: values.isActive,
          permissions: activePermissions,
        };

        const result = await createRole(payload);
        if (result && result.data) {
          fetchAllRole(currentPage);
        }
        closeModal();
      })
      .catch((info) => {
        console.error('Validation failed:', info);
      });
  };

  return (
    <Modal title='Tạo mới Role' open={isModalOpen} onCancel={closeModal} onOk={handleOk} okText='Lưu' cancelText='Hủy'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          isActive: true,
        }}
      >
        <Form.Item name='roleName' label='Tên Role' rules={[{ required: true, message: 'Vui lòng nhập tên Role' }]}>
          <Input placeholder='Nhập tên Role' />
        </Form.Item>

        <Form.Item name='description' label='Miêu tả' rules={[{ required: true, message: 'Vui lòng nhập miêu tả' }]}>
          <Input.TextArea placeholder='Nhập miêu tả' rows={3} />
        </Form.Item>

        <Form.Item name='isActive' label='Trạng thái' valuePropName='checked'>
          <Switch checkedChildren='ACTIVE' unCheckedChildren='INACTIVE' />
        </Form.Item>

        <Form.Item label='Quyền hạn'>
          <Collapse accordion>
            {(Object.keys(permissions) as (keyof PermissionIds)[]).map((item) => (
              <Panel
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item}</span>
                    <Form.Item name={`permission_${item}`} valuePropName='checked' noStyle>
                      <Switch />
                    </Form.Item>
                  </div>
                }
                key={item}
              ></Panel>
            ))}
          </Collapse>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateRoleByAdmin;
