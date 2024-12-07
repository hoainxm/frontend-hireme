/** @format */

import React, { FC, useEffect, useState } from 'react';
import { fetchCompanyById, fetchJobsByHR, fetchUserById } from '../api';
import { createJob, deleteJob } from '../../../app/admin/dashboard/components/job/api';
import { Company, Job } from '../../jobs/model';
import { CTable, CTPaging, CTPageSize, CTRow, BlankFrame, Loading, CButton } from '../../../common/ui/base';
import { Alert, Confirm } from '../../../common/utils/popup';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Form, Input, InputNumber, Modal, Select, Button, DatePicker, Row, Col, Cascader } from 'antd';
import { experienceOptions, GenderOptions, SkillsOptions, Status, WorkForm } from '../../../app/jobs/constant';
import { getAllCompanies } from '../../../app/company/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import JobTable from './JobTable';
import True from '../../../common/ui/assets/images/Success.svg';
import False from '../../../common/ui/assets/icon/Error.svg';
import TrashIcon from '../../../common/ui/assets/ic/20px/trash-bin.svg';
import Edit from '../../../common/ui/assets/icon/Edit.svg';
import { Image } from 'react-bootstrap';
import locationData from '../../jobs/components/location.json';
import EditJobModal from './EditJobModal';
import AddJobModal from './AddJobModal';

interface Props {
  id: string;
  idHr: string;
}

const JobListByHR: FC<Props> = ({ idHr }) => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalData, setTotalData] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form] = Form.useForm();
  const [idCompany, setIdCompany] = useState<string>();

  const TABLE_HEADER = [
    t('field.numeric'),
    t('field.jobName'),
    t('field.companyName'),
    t('field.location'),
    t('field.salary'),
    t('field.startDate'),
    t('field.endDate'),
    t('field.last_updated'),
    t('field.status'),
    t('field.action'),
  ];

  const fetchData = async (page: number) => {
    setIsLoading(true);
    fetchJobsByHR(page, pageSize)
      .then((res) => {
        const { meta, result } = res.data;
        setJobs(result);
        setCurrentPage(meta.current);
        setTotalData(meta.total);
      })
      .catch(() => Alert.error({ title: t('error.title'), content: t('error.fetchFailed') }))
      .finally(() => setIsLoading(false));
    const result = await fetchUserById(idHr);
    if (result && result.data) {
      setIdCompany(result.data.company._id);
    }
  };

  const loadAllCompanies = async () => {
    try {
      const res = await getAllCompanies(1, 100);

      setCompanies((res.data as any).result);
    } catch (error) {
      Alert.error(t('error.fetchCompaniesFailed'));
    }
  };

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Confirm.delete({
      title: t('confirm.deleteJob'),
      content: t('confirm.deleteJobContent'),
      onConfirm: () => {
        try {
          deleteJob(id);
          Alert.success({ title: t('success.title'), content: t('success.jobDeleted') });
          fetchData(currentPage);
        } catch (error) {
          Alert.error({ title: t('error.title'), content: t('error.stWrong') });
        }
      },
    });
  };

  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchData(1);
    loadAllCompanies();
  }, [pageSize]);

  return (
    <div>
      <div className='d-flex justify-content-end mb-3'>
        <CButton label={t('btn.admin.addJob')} onClick={() => setIsModalVisible(true)} />
      </div>
      <CTable responsive maxHeight={833}>
        <thead>
          <CTRow header data={TABLE_HEADER} />
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <CTRow
                key={job._id}
                data={[
                  index + 1,
                  job.name || t('field.notSet'),
                  job.company.name || t('field.notSet'),
                  job.location || t('field.notSet'),
                  `${job.salary.toLocaleString()} VND` || t('field.notSet'),

                  dayjs(job.startDate).format('HH:mm:ss DD-MM-YYYY'),
                  dayjs(job.endDate).format('HH:mm:ss DD-MM-YYYY'),
                  dayjs(job.updatedAt).format('HH:mm:ss DD-MM-YYYY') || t('field.notSet'),
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Image src={job.isActive ? True : False} alt={job.isActive ? 'Active' : 'Inactive'} width={20} height={20} />
                  </div>,
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Image src={Edit} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(job)} />
                    <Image src={TrashIcon} alt='delete' width={20} height={20} style={{ cursor: 'pointer' }} onClick={() => handleDelete(job._id)} />
                  </div>,
                ]}
              />
            ))
          ) : (
            <BlankFrame className='blank-frame' title={t('field.hint.noData')} />
          )}
        </tbody>
      </CTable>
      {jobs.length > 0 && (
        <div className='d-flex justify-content-between mt-5'>
          <div>
            <CTPageSize className='mt-3' onChange={onChangePageSize} totalData={totalData} defaultPageSize={pageSize} />
          </div>
          <div>
            <CTPaging className='mt-4' currentPage={currentPage} totalPage={Math.ceil(totalData / pageSize)} onGetData={fetchData} />
          </div>
        </div>
      )}
      <Loading isOpen={isLoading} />
      <AddJobModal
        idCompany={idCompany}
        visible={isModalVisible}
        onCreateSuccess={() => {
          fetchData(currentPage);
        }}
        onClose={() => setIsModalVisible(false)}
        skillsOptions={SkillsOptions.map((skill) => ({ value: skill, label: skill }))}
        workFormOptions={WorkForm.map((form) => ({ value: form, label: form }))}
        experienceOptions={experienceOptions.map((level) => ({ value: level, label: level }))}
        statusOptions={Status.map((status) => ({ value: status, label: status }))}
        genderOptions={GenderOptions.map((gender) => ({ value: gender, label: gender }))}
      />
      ;
      <EditJobModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onEditSuccess={() => {}}
        job={selectedJob}
        companies={companies}
      />
    </div>
  );
};

export default JobListByHR;
