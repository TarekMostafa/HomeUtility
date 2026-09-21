import React, {useState} from 'react';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

import ModalContainer from '../../common/ModalContainer';
import WealthTransactionTable from '../transactions/WealthTransactionTable';
import ExpenseDetailTable from '../../expenses/ExpenseDetailTable';

function LabelLinkDetails({transactions, expenseDetails, show, onHide, data}) {

    const [tabKey, setTabKey] = useState('transactionData');

    const getTitle = () => {
        if(data.dateFrom) {
            return `"${data.labelName}" label data from 
                    ${moment(data.dateFrom).format('DD/MM/YYYY')} to 
                    ${moment(data.dateTo).format('DD/MM/YYYY')} in ${data.currency}`
        }

        return `"${data.labelName}" label data in ${data.currency}`
    }

    return (
        <ModalContainer title={getTitle()} show={show}
        onHide={onHide} size='xl'>
            <Tabs id="controlled-tab" activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                <Tab eventKey="transactionData" title="Transactions Data">
                    <br />
                    <WealthTransactionTable transactions={transactions} />
                </Tab>
                <Tab eventKey="expenseData" title="Expenses Data">
                    <br />
                    <ExpenseDetailTable expenseDetails={expenseDetails} readOnly={true} />
                </Tab>
            </Tabs>
            <Alert variant="dark" className="text-center">
                <h5>{data.total} {data.currency}</h5>
            </Alert>
        </ModalContainer>
    );
}

export default LabelLinkDetails;