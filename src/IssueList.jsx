import React from 'react';
import 'whatwg-fetch';

import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';

class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        // this.createTestIssue = this.createTestIssue.bind(this);
        this.createIssue = this.createIssue.bind(this);
        // setTimeout(this.createTestIssue, 2000);
    }

    createIssue(newIssue) {
        fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIssue),
        }).then(response => {
            console.debug('create issue response:', response);
            if (response.ok) {
                console.debug('new issue response is ok');
                response.json().then(updatedIssue => {
                    console.debug('new issue:', updatedIssue);
                    updatedIssue.created = new Date(updatedIssue.created);
                    if (updatedIssue.completionDate)
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate);
                    const newIssues = this.state.issues.concat(updatedIssue);
                    this.setState({ issues: newIssues });
                });
            } else {
                response.json().then(error => {
                    alert("Failed to add issue: " + error.message)
                });
            }
        }).catch(err => {
            alert("Error in sending data to server: " + err.message);
        });
    }


    componentDidMount() {
        this.loadData();
    }

    loadData() {
        fetch('/api/issues')
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        data.records.forEach(issue => {
                            issue.created = new Date(issue.created);
                            console.debug('issue:', issue);
                            if (issue.completionDate) {
                                issue.completionDate = new Date(issue.completionDate);
                            }
                        });
                        console.debug('data.records to be set as issues state', data.records)
                        this.setState({ issues: data.records });
                    })
                } else {
                    response.json().then(error => {
                        alert("Failed to fetch issues:" + error.message)
                    });
                }
            }).catch(err => {
                console.debug('error in fetching issues:', err);
            });
    }
    render() {
        console.debug('issues:', this.state.issues);
        return (
            <div>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues} />
                <button onClick={this.createTestIssue}>Add</button>
                <hr />
                <IssueAdd createIssue={this.createIssue} />
                <p>asdzxcvzxcv</p>
            </div>
        );
    }
}

export default IssueList;