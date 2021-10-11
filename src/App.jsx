import React from 'react';
import ReactDOM from 'react-dom';

import PageContainer from './PageContainer.jsx';
const contentNode = document.getElementById('contents');


ReactDOM.render(<PageContainer />, contentNode); // Render the component inside the content Node

if (module.hot) {
    module.hot.accept();
}