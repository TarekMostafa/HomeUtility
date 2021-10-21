import React from 'react';
import { Button, Badge } from 'react-bootstrap';

function ExpenseTypeRowList(props) {
    const { groupExpenseTypes } = props;
    return (
        <div>
            {
                groupExpenseTypes && Object.keys(groupExpenseTypes).map( key => {
                    return (
                    <Button key={key} variant="outline-info" size="lg">
                        {groupExpenseTypes[key].name}  
                        {' '}<Badge pill variant="success">{groupExpenseTypes[key].totalAmt}</Badge>
                    </Button>
                    );
                })
            }
        </div>
    );
}

export default ExpenseTypeRowList;