import React from 'react';
import { Button, Badge } from 'react-bootstrap';

function ExpenseTypeRowList(props) {
    const { groupExpenseTypes } = props;
    return (
        <div>
            {
                groupExpenseTypes && Object.entries(groupExpenseTypes)
                    .sort(([,a],[,b])=> a.totalAmt < b.totalAmt).map(elem => {
                        return (
                            <Button key={elem[0]} variant="outline-info" size="lg">
                                {elem[1].name}  
                                {' '}<Badge pill variant="success">{elem[1].totalAmt}</Badge>
                            </Button>
                        );
                })
            }
        </div>
    );
}

export default ExpenseTypeRowList;