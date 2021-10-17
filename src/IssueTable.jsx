import React from 'react';
import IssueRow from './IssueRow';

function IssueTable(props) {
  const headers = ['Id', 'Status', 'Owner', 'Created', 'Effort', 'Completion Date', 'Title'];
  const issueRows = props.issues.map((issue) => <IssueRow key={issue._id} issue={issue} />);
  return (
    <table className="bordered-table" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((theader) => <th key={theader}>{theader}</th>)}
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}

export default IssueTable;
