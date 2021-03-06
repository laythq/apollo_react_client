import React from 'react';
import RepositoryItem from '../RepositoryItem';
import '../../style.css';
import Loading from '../../Loading';
import FetchMore from '../../FetchMore/index.jsx';
import Issues from '../../Issue';

const getUpdateQuery =
  (entry) =>
  (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }
    return {
      ...previousResult,
      [entry]: {
        ...previousResult[entry],
        repositories: {
          ...previousResult[entry].repositories,
          ...fetchMoreResult[entry].repositories,
          edges: [
            ...previousResult[entry].repositories.edges,
            ...fetchMoreResult[entry].repositories.edges,
          ],
        },
      },
    };
  };

const RepositoryList = ({ entry, loading, repositories, fetchMore }) => (
  <div>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
        <Issues repositoryName={node.name} repositoryOwner={node.owner.login} />
      </div>
    ))}

    {loading ? (
      <Loading />
    ) : (
      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        Repositories
      </FetchMore>
    )}
  </div>
);

export default RepositoryList;
