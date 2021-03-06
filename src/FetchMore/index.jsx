import React from 'react';
import Loading from '../Loading';
import Button, { ButtonUnobtrusive } from '../Button';
import './FetchMore.css';

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      <ButtonUnobtrusive
        type="button"
        className="FetchMore-button"
        onClick={() => fetchMore({ variables, updateQuery })}
      >
        More {children}
      </ButtonUnobtrusive>
    )}
  </div>
);

export default FetchMore;
