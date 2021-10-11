import React from 'react';
import IssueList from './IssueList.jsx';
import HMRTest from './Components/HMRTest.jsx';
export default class PageContainer extends React.Component {
    render() {
        return <>
            <IssueList />
            <HMRTest />
        </>
    }
}