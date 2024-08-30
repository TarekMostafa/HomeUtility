import React from 'react';
import { Alert } from 'react-bootstrap';

import WealthTransactionTable from '../wealth/transactions/WealthTransactionTable';
import ModalContainer from '../common/ModalContainer';

function MonthlyLinkDetails({transactions, show, onHide, data}) {

    const getTitle = () => {
        return `"${data.typeName}" transactions from ${data.fromDate} to ${data.toDate} in ${data.currency}`
    }

    return (
        <ModalContainer title={getTitle()} show={show}
        onHide={onHide} size='xl'>
            <WealthTransactionTable transactions={transactions} />
            <Alert variant="dark" className="text-center">
                <h5>{data.totalFormatted} {data.currency}</h5>
            </Alert>
        </ModalContainer>
    );
}

export default MonthlyLinkDetails;