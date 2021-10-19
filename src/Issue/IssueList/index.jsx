import React, { useState } from 'react';
import gql from 'graphql-tag';
import './IssueList.css';
import { useQuery, ApolloConsumer } from '@apollo/client';
import { withState } from 'recompose';
import ErrorMessage from '../../Error';
import Loading from '../../Loading';
import IssueItem from '../IssueItem';
import { ButtonUnobtrusive } from '../../Button';

const GET_ISSUES_OF_REPOSITORY = gql`
  query (
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState]) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
      }
    }
  }
`;

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

const IssueList = ({ issues }) => (
  <div>
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </div>
);

const IssueFilter = ({
  repositoryOwner,
  repositoryName,
  issueState,
  setIssueState,
}) => {
  const prefetchIssues = (
    client,
    repositoryOwner,
    repositoryName,
    issueState
  ) => {
    const nextIssueState = TRANSITION_STATE[issueState];

    if (isShow(nextIssueState)) {
      client.query({
        query: GET_ISSUES_OF_REPOSITORY,
        variables: {
          repositoryOwner,
          repositoryName,
          issueState: nextIssueState,
        },
      });
    }
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <ButtonUnobtrusive
          onClick={() => setIssueState(TRANSITION_STATE[issueState])}
          onMouseOver={() =>
            prefetchIssues(client, repositoryOwner, repositoryName, issueState)
          }
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobtrusive>
      )}
    </ApolloConsumer>
  );
};

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  setIssueState,
}) => {
  const { data, loading, error } = useQuery(GET_ISSUES_OF_REPOSITORY, {
    variables: {
      repositoryName,
      repositoryOwner,
      issueState,
    },
    skip: !isShow(issueState),
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  let filteredRepository = {};

  if (data) {
    const { repository } = data;

    filteredRepository = {
      issues: {
        edges: repository.issues.edges.filter(
          (issue) => issue.node.state === issueState
        ),
      },
    };
  }

  return (
    <div className="Issues">
      <IssueFilter
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueState={issueState}
        setIssueState={setIssueState}
      />
      <div>
        {error && <ErrorMessage error={error} />}
        {loading && <Loading />}
        {data &&
          isShow(issueState) &&
          !data?.repository.issues.edges.length &&
          'No issues...'}
        {data && isShow(issueState) && (
          <div className="IssueList">
            <IssueList issues={filteredRepository.issues} />
          </div>
        )}
      </div>
    </div>
  );
};

export default withState(
  'issueState',
  'setIssueState',
  ISSUE_STATES.NONE
)(Issues);
