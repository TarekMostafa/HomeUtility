import React from 'react';
import { Alert } from 'react-bootstrap';

function NoData() {
    return (
        <Alert variant="warning" className="text-center">
            <h5>No Data</h5>
        </Alert>
    )
}

export default NoData;