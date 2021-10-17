import React from 'react';
import { Link } from 'react-router-dom';

export default class IssueEdit extends React.Component {
  constructor() {
    console.debug('constructing IssueEdit component');
    super();
    this.state = {
      issue: {
        _id: '',
        title: '',
        status: '',
        owner: '',
        effort: '',
        completionDate: '',
        created: '',
      },
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line
    console.debug('issueedit did update props:', this.props);
    console.debug('issueedit did update prevprops:', prevProps);
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadData();
    }
  }

  onChange(event) {
    const { issue } = this.state;

    issue[event.target.name] = event.target.value;
    this.setState({ issue });
  }

  loadData() {
    // console.log(`/api/issues/${this.props.match.params.id}`);
    // console.log( new URLSearchParams(this.props.location.search));

    // eslint-disable-next-line
    fetch(`/api/issues/${this.props.match.params.id}`).then((response) => {
      console.debug('fetched IssueEdit item');
      if (response.ok) {
        response.json().then((issue) => {
          console.debug('issue fetched:', issue);
          // issue.created = new Date(issue.created).toDateString();
          // change null/undefined into blank strings so input values will remain "controlled"
          issue.effort = issue.effort || '';
          issue.created = new Date(issue.created).toDateString() || '';
          issue.completionDate = issue.completionDate != null
            // new Date(is
            ? new Date(issue.completionDate).toDateString() : '';
          // issue.effort = issue.effort != null ? issue.effort.toString() : '';

          this.setState({ issue });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to fetch issue: ${error.message}`);
          // this.showError(`Failed to fetch issue: ${error.message}`);
        });
      }
    }).catch((err) => {
      alert(`Error in fetching data from server: ${err.message}`);
    });
  }

  render() {
    const { issue } = this.state;
    console.debug('IssueEdit issue to render:', issue);
    return (
      <>
        <div>
          <form>
            ID:
            {' '}
            {issue._id}
            <br />
            Created:
            {' '}
            {issue.created}
            <br />
            Status:
            {' '}
            <select
              name="status"
              value={issue.status}
              onChange={this.onChange}
            >
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </select>
            <br />
            Owner:
            {' '}
            <input
              name="owner"
              value={issue.owner}
              onChange={this.onChange}
            />
            <br />
            Effort:
            {' '}
            <input
              size={5}
              name="effort"
              value={issue.effort}
              onChange={this.onChange}
            />
            <br />
            Completion Date:
            {' '}
            <input
              name="completionDate"
              value={issue.completionDate}
              onChange={this.onChange}
            />
            <br />
            Title:
            {' '}
            <input
              name="title"
              size={50}
              value={issue.title}
              onChange={this.onChange}
            />
            <br />
            <button type="submit">Submit</button>
            <Link to="/issues">Back to issue list</Link>
          </form>
        </div>
      </>
    );
  }
}