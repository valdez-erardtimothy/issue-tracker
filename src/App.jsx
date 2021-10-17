import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import Layout from './Layout';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page not Found</p>;
const RoutedApp = () => (
  <Router>
    <Redirect exact from="/" to="/issues" />
    <Layout>
      <Switch>
        <Route exact path="/issues" component={IssueList} />
        <Route exact path="/issues/:id" component={IssueEdit} />
        {/* <Route exact path="/issues/:id" component={NoMatch} /> */}
        <Route path="*" component={NoMatch} />
      </Switch>
    </Layout>
  </Router>
);

ReactDOM.render(
  <AppContainer>
    <RoutedApp />
  </AppContainer>,
  contentNode,
);
if (module.hot) {
  module.hot.accept();
}
