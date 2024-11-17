import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createData, fetchData, updateData } from '../../api';

export const JobForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      fetchData(`jobs/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setCompanyId(res.data.companyId);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = { title, companyId };
    const apiCall = id ? updateData(`jobs`, id, data) : createData(`jobs`, data);

    apiCall
      .then(() => {
        alert(id ? 'Job updated successfully!' : 'Job created successfully!');
        history.push('/dashboard/jobs');
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Job' : 'Create Job'}</h2>
      <input type='text' placeholder='Job Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type='text' placeholder='Company ID' value={companyId} onChange={(e) => setCompanyId(e.target.value)} required />
      <button type='submit'>{id ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default JobForm;
