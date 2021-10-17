import React from 'react';
import { Link } from 'react-router-dom';

const IssueRow = ({ issue }) => (
  <tr>
    {/* <td>{props.issue._id}</td> */}
    <td>
      <Link to={`/issues/${issue._id}`}>
        {issue._id.substr(-4)}
      </Link>
    </td>
    <td>{issue.status}</td>
    <td>{issue.owner}</td>
    <td>{issue.created.toDateString()}</td>
    <td>{issue.effort}</td>
    <td>
      {issue.completionDate
        ? issue.completionDate.toDateString() : ''}

    </td>
    <td>{issue.title}</td>

  </tr>
);

export default IssueRow;
