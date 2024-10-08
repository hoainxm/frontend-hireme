import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../jobs.module.scss';
import { useParams } from 'react-router-dom';
import { Job } from '../model';

const JobDetail: React.FC<{ jobId: string }> = ({ jobId }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hàm lấy thông tin chi tiết của job từ API
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/jobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job details');
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return <p className={styles.loading}>Loading job details...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!job) {
    return <p className={styles.noJob}>No job found</p>;
  }

  return (
    <div className={styles.jobDetailContainer}>
      <h1 className={styles.jobTitle}>{job.name}</h1>
      <p className={styles.location}>Location: {job.location}</p>
      <div className={styles.companyContainer}>
        <p className={styles.companyName}>Company: {job.company.name}</p>
        <img src={job.company.logo} alt={`${job.company.name} logo`} className={styles.companyLogo} />
      </div>
      <p className={styles.level}>Level: {job.level}</p>
      <p className={styles.salary}>Salary: {job.salary.toLocaleString()} VND</p>
      <p className={styles.quantity}>Quantity: {job.quantity}</p>
      <p className={styles.startDate}>Start Date: {new Date(job.startDate).toLocaleDateString()}</p>
      <p className={styles.endDate}>End Date: {new Date(job.endDate).toLocaleDateString()}</p>
      <h3 className={styles.skillsHeader}>Skills Required:</h3>
      <ul className={styles.skillsList}>
        {job.skills.map((skill, index) => (
          <li key={index} className={styles.skillItem}>
            {skill}
          </li>
        ))}
      </ul>
      <p className={styles.createdBy}>Created by: {job.createdBy.email}</p>
    </div>
  );
};

export default JobDetail;
