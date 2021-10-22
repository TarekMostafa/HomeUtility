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
                            <React.Fragment key={elem[0]}>
                            <Button key={elem[0]} variant="outline-info" size="md"
                                onClick={() => props.onExpenseTypeClick(elem[0])}>
                                {elem[1].name}  
                                {' '}<Badge pill variant="success">{elem[1].totalAmt}</Badge>
                            </Button>{' '}
                            </React.Fragment>
                        );
                })
            }
        </div>
    );
}

export default ExpenseTypeRowList;