import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ApolloProvider, ApolloClient } from '@apollo/react-hooks';
import App from './App';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PAT}`,
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('GRAPHQL Error: ', graphQLErrors);
  }

  if (networkError) {
    console.log('NETWORK Errors: ', networkError);
  }
});

// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         viewer: {
//           keyArgs: false,
//           merge(existing = [], incoming) {
//             console.log(existing, incoming.repositories);
//             return [...existing, ...incoming];
//           },
//         },
//       },
//     },
//   },
// });

const cache = new InMemoryCache();

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
