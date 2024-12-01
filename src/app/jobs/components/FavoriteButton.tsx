import React, { useEffect, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Job } from '../model';
import style from '../jobs.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { message, Tooltip } from 'antd';
import useLoginAlert from '../../../common/utils/hooks/useLoginAlert';
import { useTranslation } from 'react-i18next';

interface FavoriteButtonProps {
  job: Job;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { isLoginRequired } = useLoginAlert();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    if (token) {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const jobIsSaved = savedJobs.some((savedJob: Job) => savedJob._id === job._id);
      setIsSaved(jobIsSaved);
    }
  }, [job._id]);

  const saveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!savedJobs.some((savedJob: Job) => savedJob._id === job._id)) {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setIsSaved(true);
      message.success(`${t('saveJob.success')} ${job.name}`);
    }
  };

  const unSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.stopPropagation();
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }

    let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    savedJobs = savedJobs.filter((savedJob: Job) => savedJob._id !== job._id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    setIsSaved(false);
    message.info(`${t('unsaveJob.success')} ${job.name}`);
  };

  return (
    <>
      <Tooltip title={isSaved ? t('btn.unsave') : t('btn.save')}>
        <div className={style.btnHeart} aria-label={isSaved ? 'Unsave job' : 'Save job'} onClick={isSaved ? unSaveJob : saveJob}>
          {isSaved ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
        </div>
      </Tooltip>
    </>
  );
};

export default FavoriteButton;
