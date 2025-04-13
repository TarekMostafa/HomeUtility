import React from 'react';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

import WealthTransactionTable from '../transactions/WealthTransactionTable';
import ModalContainer from '../../common/ModalContainer';

function LabelLinkDetails({transactions, show, onHide, data}) {

    const getTitle = () => {
        return `'"${data.labelName}"' label transactions from 
            ${moment(data.dateFrom).format('DD/MM/YYYY')} to 
            ${moment(data.dateTo).format('DD/MM/YYYY')} in ${data.currency}`
    }

    return (
        <ModalContainer title={getTitle()} show={show}
        onHide={onHide} size='xl'>
            <WealthTransactionTable transactions={transactions} />
            <Alert variant="dark" className="text-center">
                <h5>{data.total} {data.currency}</h5>
            </Alert>
        </ModalContainer>
    );
}

export default LabelLinkDetails;