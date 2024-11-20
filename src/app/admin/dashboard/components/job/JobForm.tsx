import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobById, createJob, updateJob } from './api'; // Import your API functions
import style from './job.module.scss';

const JobForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [job, setJob] = useState({ name: '', salary: 0, location: '', skills: '', company: '' });

  useEffect(() => {
    if (id) {
      fetchJobById(id).then((data) => setJob(data)); // Fetch job details if editing
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateJob(id, job).then(() => alert('Job updated successfully!'));
    } else {
      createJob(job).then(() => alert('Job created successfully!'));
    }
  };

  return (
    <form className={style.jobForm} onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Job' : 'Create Job'}</h2>
      <label>
        Job Name:
        <input type='text' name='name' value={job.name} onChange={handleInputChange} required />
      </label>
      <label>
        Salary:
        <input type='number' name='salary' value={job.salary} onChange={handleInputChange} required />
      </label>
      <label>
        Location:
        <input type='text' name='location' value={job.location} onChange={handleInputChange} required />
      </label>
      <label>
        Skills:
        <input type='text' name='skills' value={job.skills} onChange={handleInputChange} required />
      </label>
      <label>
        Company:
        <input type='text' name='company' value={job.company} onChange={handleInputChange} required />
      </label>
      <button type='submit'>{id ? 'Update Job' : 'Create Job'}</button>
    </form>
  );
};

export default JobForm;
