import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import JobList from './JobList';
import JobForm from './JobForm';

const JobManagement: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={JobList} />
      <Route path={`${path}/edit/:id`} component={JobForm} />
      <Route path={`${path}/create`} component={JobForm} />
    </Switch>
  );
};

export default JobManagement;
