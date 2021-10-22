import React from 'react';
import { Button, Badge } from 'react-bootstrap';

function ExpenseDetailSummary(props) {
    return (
        <React.Fragment>
            <Button variant="outline-info" size="md" onClick={props.onAllClick}>
                All items <Badge pill variant="success">{props.expenseDetails.length}</Badge>
            </Button>
            {' '}
            <Button variant="outline-info" size="md" onClick={props.onDebitClick}>
                Debits <Badge pill variant="success">{props.expenseDetails.filter(elem => !elem.expenseAdjusment).length}</Badge>
            </Button>
            {' '}
            <Button variant="outline-info" size="md" onClick={props.onAdjClick}>
                Adjusments <Badge pill variant="success">{props.expenseDetails.filter(elem => elem.expenseAdjusment).length}</Badge>
            </Button>
            {' '}
            <Button variant="outline-info" size="md" onClick={props.onNegClick}>
                Negatives <Badge pill variant="success">{props.expenseDetails.filter(elem => elem.expenseAmount < 0).length}</Badge>
            </Button>
            <br />
        </React.Fragment>
    )
}

export default ExpenseDetailSummary;