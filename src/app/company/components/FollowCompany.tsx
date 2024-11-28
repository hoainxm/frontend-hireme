import React, { useEffect, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import style from '../company.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

interface FollowCompanyProps {
  companyId: string;
  companyName: string;
}

const FollowCompany: React.FC<FollowCompanyProps> = ({ companyId, companyName }) => {
  const { t } = useTranslation();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  useEffect(() => {
    const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    const companyIsFollowed = followedCompanies.some((id: string) => id === companyId);
    setIsFollowed(companyIsFollowed);
  }, [companyId]);

  const followCompany = () => {
    const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    followedCompanies.push(companyId);
    localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
    setIsFollowed(true);
    toast.success(`You are now following: ${companyName}`);
  };

  const unFollowCompany = () => {
    let followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    followedCompanies = followedCompanies.filter((id: string) => id !== companyId);
    localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
    setIsFollowed(false);
    toast.info(`You have unfollowed: ${companyName}`);
  };

  return (
    <button className={style.followCompanyButton} onClick={isFollowed ? unFollowCompany : followCompany}>
      {/* {isFollowed ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />} */}
      {isFollowed ? t('unfollow') : t('follow.Btn')}
    </button>
  );
};

export default FollowCompany;
