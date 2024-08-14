import React from 'react';

import WealthTransactionTable from '../wealth/transactions/WealthTransactionTable';
import ModalContainer from '../common/ModalContainer';

function MonthlyLinkDetails({transactions, show, onHide, data}) {

    const getTitle = () => {
        return `"${data.typeName}" transactions from ${data.fromDate} to ${data.toDate}`
    }

    return (
        <ModalContainer title={getTitle()} show={show}
        onHide={onHide} size='xl'>
            <WealthTransactionTable transactions={transactions} />
        </ModalContainer>
    );
}

export default MonthlyLinkDetails;