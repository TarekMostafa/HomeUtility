import React, {useState} from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';

import LabelTransactionSearch from './LabelTransactionSearch';
import LabelByCurrencyList from './LabelByCurrencyList';

function LabelTransactionList () {

    const [tabKey, setTabKey] = useState('labelList');

    return (
        <React.Fragment>
            <FormContainer title="Label Transactions/Expenses Statistics">
                <Tabs id="controlled-tab" activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                    <Tab eventKey="labelList" title="Label List">
                        <br />
                        <LabelByCurrencyList />
                    </Tab>
                    <Tab eventKey="labelSearch" title="Label Search">
                        <br />
                        <LabelTransactionSearch />
                    </Tab>
                </Tabs>
            </FormContainer>
        </React.Fragment>
    );
}

export default LabelTransactionList;