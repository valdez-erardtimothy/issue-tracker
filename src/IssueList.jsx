import { hot } from 'react-hot-loader';
import React from 'react';
import { withRouter } from 'react-router-dom';
import 'whatwg-fetch';

import IssueAdd from './IssueAdd';
import IssueFilter from './IssueFilter';
import IssueTable from './IssueTable';

class IssueList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { issues: [] };
    // this.createTestIssue = this.createTestIssue.bind(this);
    this.createIssue = this.createIssue.bind(this);
    // setTimeout(this.createTestIssue, 2000);
    this.setFilter = this.setFilter.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const oldQuery = new URLSearchParams(prevProps.location.search);
    // eslint-disable-next-line
    const newQuery = new URLSearchParams(this.props.location.search);
    const newStatus = newQuery.get('status');
    const oldStatus = oldQuery.get('status');
    // did not get value of status
    // if (oldQuery.status === newQuery.status) {
    // use constants
    if (newStatus === oldStatus
        && oldQuery.effort_gte === newQuery.effort_gte
        && oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }

  setFilter(search) {
    // console.log(search);
    const searchParamsObject = new URLSearchParams(search);
    console.log(searchParamsObject.toString());
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: searchParamsObject.toString(),
    });
  }

  createIssue(newIssue) {
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    }).then((response) => {
      // console.debug('create issue response:', response);
      if (response.ok) {
        // console.debug('new issue response is ok');
        response.json().then((updatedIssue) => {
          // console.debug('new issue:', updatedIssue);
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) {
            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          }
          const newIssues = this.state.issues.concat(updatedIssue);
          this.setState({ issues: newIssues });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to add issue: ${error.message}`);
        });
      }
    }).catch((err) => {
      alert(`Error in sending data to server: ${err.message}`);
    });
  }

  loadData() {
    const search = new URLSearchParams(this.props.location.search);
    // const status = search.get('status');
    console.log('loadData() search:', search);
    // eslint-disable-next-line
    fetch(`/api/issues${this.props.location.search}`).then((response) => response.json()).then((data) => {
      console.log('loadData() fetched:', data);
      // eslint-disable-next-line
      console.log('Total count of records:', data._metadata.total_count);
      console.log(data);
      data.records.forEach((issue) => {
        issue.created = new Date(issue.created);
        if (issue.completionDate) { issue.completionDate = new Date(issue.completionDate); }
      });
      this.setState({ issues: data.records });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    // console.debug('issues:', this.state.issues);
    const { issues } = this.state;
    return (
      <div>
        <h1>Issue Tracker</h1>
        <IssueFilter
          setFilter={this.setFilter}
          initFilter={this.props.location.search}
        />
        <hr />
        <IssueTable issues={issues} />
        <button
          type="button"
          onClick={this.createTestIssue}
        >
          Add
        </button>
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <p />
      </div>
    );
  }
}
export default hot(module)(withRouter(IssueList));
