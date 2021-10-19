import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Loading from '../Loading';
import RepositoryList from '../Repository';
import ErrorMessage from '../Error';
import { GET_REPOSITORIES_OF_CURRENT_USER } from '../constants/queries';

const Profile = () => {
  const { loading, error, data, fetchMore } = useQuery(
    GET_REPOSITORIES_OF_CURRENT_USER,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (loading && !data) {
    return <Loading />;
  }

  const { viewer } = data;

  return (
    <RepositoryList
      loading={loading}
      repositories={viewer.repositories}
      fetchMore={fetchMore}
      entry="viewer"
    />
  );
};

export default Profile;
