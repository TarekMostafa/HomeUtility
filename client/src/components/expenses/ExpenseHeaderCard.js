import React from 'react';
import { Card, Button } from 'react-bootstrap';

import { getMonthName } from '../common/MonthYearField';
import ExpenseHeaderCardBody from './ExpenseHeaderCardBody';
import ExpenseHeaderCardBodyInline from './ExpenseHeaderCardBodyInline';

function ExpenseHeaderCard(props) {

    const { expense, inline } = props;

    return (
        <Card>
        {
            expense && 
            <Card.Header>
            {getMonthName(expense.expenseMonth)} {expense.expenseYear} ({expense.expenseCurrency})
            {props.onDetails && <Button className="float-right" variant="link" size="sm"
                onClick={() => props.onDetails()}>Details</Button>}
            </Card.Header>
        }
        { inline ?<ExpenseHeaderCardBodyInline expense={expense}/>
                :<ExpenseHeaderCardBody expense={expense}/>
        }
        {
            props.onEdit && <Card.Footer>
                <Button variant="link" size="sm"
                onClick={() => props.onEdit(expense.expenseId)}>Edit</Button>
            </Card.Footer>
        }    
        </Card>
    );
}

export default ExpenseHeaderCard;