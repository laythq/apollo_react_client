# React-Apollo-Client
### Built as part of The Road to GraphQL by Robin Wieruch

A simplified Github client that consumes Github's GraphQL API using the Apollo Client library and React. 

Demostrates the following features:
- basic Apollo query and mutation hooks (`useQuery` and `useMutation`) as well as render prop components (`<Query />`/`<Mutation />`), using GraphQL fragments.
- custom client network behaviour using Apollo Link (e.g. application-level error handling using `apollo-link-error`)
- local state management in Apollo Client cache, using Apollo's cache API (`readQuery()`/`writeQuery()`/`modify()`)
- Optimistic UI for improved user experience
- cursor-based graphQL pagination for small and fast network responses, using the core Apollo Pagination API (`fetchMore()` etc...)
- query caching to avoid duplicate requests
- client- and server-side query filtering 
- Apollo Client prefetching using direct client instance ApolloConsumer component and render prop function; nice example of imperative GQL queries

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**


