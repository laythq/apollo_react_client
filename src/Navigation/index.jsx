import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as routes from '../constants/routes';
import Input from '../Input';
import Button from '../Button';
import './Navigation.css';

const OrganizationSearch = ({ organizationName, setOrganizationName }) => {
  const [localOrganizationName, setLocalOrganizationName] =
    useState(organizationName);

  const onChange = (event) => {
    setLocalOrganizationName(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setOrganizationName(localOrganizationName);
  };

  return (
    <div className="Navigation-search">
      <form onSubmit={onSubmit}>
        <Input
          color="white"
          type="text"
          value={localOrganizationName}
          onChange={onChange}
        />{' '}
        <Button color="white" type="submit">
          Search
        </Button>
      </form>
    </div>
  );
};

const Navigation = ({
  location: { pathname },
  organizationName,
  setOrganizationName,
}) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className="Navigation-link">
      <Link to={routes.ORGANIZATION}>Organization</Link>
    </div>

    {pathname === routes.ORGANIZATION && (
      <OrganizationSearch
        orgnizationName={organizationName}
        setOrganizationName={setOrganizationName}
      />
    )}
  </header>
);
export default withRouter(Navigation);
