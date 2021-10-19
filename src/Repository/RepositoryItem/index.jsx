import React from 'react';
import { useMutation, gql } from '@apollo/client';
import Link from '../../Link';
import './RepositoryItem.css';
import '../../style.css';
import Button from '../../Button';
import { STAR_REPOSITORY, UNSTAR_REPOSITORY } from '../../constants/queries';

const REPOSITORY_FRAGMENT = gql`
  fragment RepoFragment on Repository {
    id
    name
    url
    descriptionHTML
    primaryLanguage {
      name
    }
    owner {
      login
      url
    }
    stargazers {
      totalCount
    }
    viewerHasStarred
    watchers {
      totalCount
    }
    viewerSubscription
  }
`;

const WATCH_REPOSITORY = gql`
  mutation ($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = (viewerSubscription) =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => {
  const [addStar] = useMutation(STAR_REPOSITORY, {
    variables: {
      id,
    },
    update(cache, data) {
      // cache.modify({
      //   id: `Repository:${id}`,
      //   fields: {
      //     stargazers(stargazers, { readField }) {
      //       console.log('stargazers', stargazers);

      //       return readField('totalCount') + 1;
      //     },
      //   },
      // });
      const repository = cache.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
      });

      const totalCount = repository.stargazers.totalCount + 1;

      cache.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
          ...repository,
          stargazers: {
            ...repository.stargazers,
            totalCount,
          },
        },
      });
    },
  });

  const [removeStar] = useMutation(UNSTAR_REPOSITORY, {
    variables: {
      id,
    },
    update(cache, data) {
      // cache.modify({
      //   id: `Repository:${id}`,
      //   fields: {
      //     stargazers(stargazers, { readField }) {
      //       console.log('stargazers', stargazers);
      //       return readField('totalCount') - 1;
      //     },
      //   },
      // });
      const repository = cache.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
      });

      const totalCount = repository.stargazers.totalCount - 1;

      cache.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
          ...repository,
          stargazers: {
            ...repository.stargazers,
            totalCount,
          },
        },
      });
    },
  });

  const [watchRepo] = useMutation(WATCH_REPOSITORY, {
    variables: {
      id,
      viewerSubscription: isWatch(viewerSubscription)
        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
    },
    update(
      cache,
      {
        data: {
          updateSubscription: {
            subscribable: { id, viewerSubscription },
          },
        },
      }
    ) {
      const repository = cache.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
      });

      let { totalCount } = repository.watchers;
      totalCount =
        viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
          ? totalCount + 1
          : totalCount - 1;

      cache.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
          ...repository,
          watchers: {
            ...repository.watchers,
            totalCount,
          },
        },
      });
    },
    optimisticResponse: {
      updateSubscription: {
        __typename: 'Mutation',
        subscribable: {
          __typename: 'Repository',
          id,
          viewerSubscription: isWatch(viewerSubscription)
            ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
            : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
        },
      },
    },
  });

  const updateAddStar = (
    cache,
    {
      data: {
        addStar: {
          starrable: { id },
        },
      },
    }
  ) => {
    const repository = cache.readFragment({
      id: `Repository:${id}`,
      fragment: REPOSITORY_FRAGMENT,
    });

    const totalCount = repository.stargazers.totalCount + 1;

    cache.writeFragment({
      id: `Repository:${id}`,
      data: {
        ...repository,
        stargazers: {
          ...repository.stargazers,
          totalCount,
        },
      },
    });
  };

  return (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div className="RepositoryItem-title-action">
          {!viewerHasStarred ? (
            <Button onClick={addStar} className="RepositoryItem-title-action">
              {stargazers.totalCount} Stars
            </Button>
          ) : (
            <Button
              onClick={removeStar}
              className="RepositoryItem-title-action"
            >
              Unstar ({stargazers.totalCount} Stars)
            </Button>
          )}
          <Button onClick={watchRepo} className="RepositoryItem-title-action">
            {watchers.totalCount}
            {' - '}
            {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
          </Button>
        </div>
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryItem;
