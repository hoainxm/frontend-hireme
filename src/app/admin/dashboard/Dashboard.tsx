import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import DataTable from './components/DataTable';
import CompanyForm from './components/company/CompanyForm';
import JobForm from './components/job/JobForm';
import UserForm from './components/user/UserForm';
import CVForm from './components/cv/CVForm';

export const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ marginBottom: '20px' }}>
        <Link to='/dashboard/companies' style={{ marginRight: '10px' }}>
          Companies
        </Link>
        <Link to='/dashboard/jobs' style={{ marginRight: '10px' }}>
          Jobs
        </Link>
        <Link to='/dashboard/users' style={{ marginRight: '10px' }}>
          Users
        </Link>
        <Link to='/dashboard/cvs'>CVs</Link>
      </nav>

      <Switch>
        <Switch>
          <Route path='/dashboard/users/new' component={UserForm} />
          <Route path='/dashboard/users/:id' component={UserForm} />
          <Route path='/dashboard/cvs/new' component={CVForm} />
          <Route path='/dashboard/cvs/:id' component={CVForm} />
        </Switch>

        {/* Route mặc định */}
        <Route path='/dashboard' component={() => <p>Select a section from above.</p>} />
      </Switch>
    </div>
  );
};

export default Dashboard;
