// Layout.jsx
import React from 'react';

const Layout = ({ children }) => (
  <div>
    <div className="header">
      <h1>Issue Tracker</h1>
    </div>
    <div className="container-fluid">
      {children}
      <hr />
      <h5>
        <small>
          Full source code available at this
          {' '}
          <a href="https://github.com/vasansr/pro-mern-stack">
            GitHub repository
          </a>
          .
        </small>

      </h5>
    </div>
  </div>
);
export default Layout;
