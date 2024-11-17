import React, { useEffect, useState } from 'react';
import { fetchAllJobs, deleteJob } from './api'; // Import your API functions
import { useHistory } from 'react-router-dom';
import style from './job.module.scss';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchAllJobs().then((data) => setJobs(data));
  }, []);

  const handleEdit = (id: string) => {
    history.push(`/admin/jobs/edit/${id}`); // Navigate to JobForm for editing
  };

  const handleDelete = (id: string) => {
    deleteJob(id).then(() => setJobs(jobs.filter((job) => job._id !== id)));
  };

  return (
    <div className={style.jobList}>
      <h2>Job Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.name}</td>
              <td>{job.salary.toLocaleString()} VND</td>
              <td>{job.location}</td>
              <td>
                <button onClick={() => handleEdit(job._id)}>Edit</button>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
