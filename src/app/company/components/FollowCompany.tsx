import React, { useEffect, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import style from '../company.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import useLoginAlert from '@hooks/useLoginAlert';
import { Company } from 'app/jobs/model';
import { message } from 'antd';

interface FollowCompanyProps {
  company: Company;
}

const FollowCompany: React.FC<FollowCompanyProps> = ({ company }) => {
  const { t } = useTranslation();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { isLoginRequired } = useLoginAlert();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    if (token) {
      const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
      const companyIsFollowed = followedCompanies.some((followedCompanies: Company) => followedCompanies._id === company._id);
      setIsFollowed(companyIsFollowed);
    }
  }, [company._id]);

  const followCompany = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }
    const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    if (!followedCompanies.some((followedCompanies: Company) => followedCompanies._id === company._id)) {
      followedCompanies.push(company);
      localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
      setIsFollowed(true);
      message.success(`${t('follow.success')} ${company.name}`);
    }
  };

  const unFollowCompany = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.stopPropagation();
    if (!isLoggedIn) {
      isLoginRequired();
      return;
    }

    let followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    followedCompanies = followedCompanies.filter((company: any) => followedCompanies._id !== company.id);
    localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
    setIsFollowed(false);
    message.info(`${t('unfollow.success')} ${company.name}`);
  };

  return (
    <button className={style.followCompanyButton} onClick={isFollowed ? unFollowCompany : followCompany}>
      {isFollowed ? t('unfollow') : t('follow.Btn')}
    </button>
  );
};
export default FollowCompany;
