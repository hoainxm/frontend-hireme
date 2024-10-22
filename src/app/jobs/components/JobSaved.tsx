import React, { useEffect, useState } from 'react';
import { Job } from '../model';
import FavoriteButton from '../components/FavoriteButton'; // Import SaveJobButton

const JobSaved: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  // Lấy danh sách công việc đã lưu từ localStorage khi component mount
  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(storedJobs);
  }, []);

  return (
    <div>
      <h4>Công việc đã lưu</h4>
      {savedJobs.length > 0 ? (
        savedJobs.map((job) => (
          <div key={job._id}>
            <h5>{job.name}</h5>
            <p>{job.company.name}</p>
            <p>{job.salary.toLocaleString()} VND</p>
            {/* Sử dụng SaveJobButton để cho phép bỏ lưu ngay từ trang công việc đã lưu */}
            <FavoriteButton job={job} />
          </div>
        ))
      ) : (
        <p>Không có công việc nào đã lưu.</p>
      )}
    </div>
  );
};

export default JobSaved;
