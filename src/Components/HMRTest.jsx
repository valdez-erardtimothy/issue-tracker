import React, { useEffect } from 'react';

export default function HMRTest(props) {
    useEffect(() => {
        console.debug('HMR component rendering');
    })

    return <>
        <p>asdasdst</p>
    </>
}