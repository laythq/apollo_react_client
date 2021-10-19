import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Profile from './Profile';
import * as routes from './constants/routes';
import Organization from './Organization';
import Navigation from './Navigation';

function App() {
  const [organizationName, setOrganizationName] = useState(
    'the-road-to-learn-react'
  );

  return (
    <Router>
      <div className="App">
        <Navigation
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
        />
        <div className="App-main">
          <Route
            exact
            path={routes.ORGANIZATION}
            component={() => (
              <div className="App-content_large-header">
                <Organization organizationName={organizationName} />
              </div>
            )}
          />
          <Route
            exact
            path={routes.PROFILE}
            component={() => (
              <div className="App-content_small-header">
                <Profile />
              </div>
            )}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
