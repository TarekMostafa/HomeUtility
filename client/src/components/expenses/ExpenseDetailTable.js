import React from 'react';
import { Table, Row, Col, Alert, Form } from 'react-bootstrap';

import ExpenseDetailAddRow from './ExpenseDetailAddRow';
import ExpenseDetailRow from './ExpenseDetailRow';

function ExpenseDetailTable(props) {

    const handleCheckBoxChange = (event, expenseDetail) => {
    if (typeof props.onSelect=== 'function') 
        props.onSelect(event.target.checked, expenseDetail)
    }   

    let alertText = "";
    if (props.totalCount || props.totalCount === 0) {
        alertText = `Number of records ${props.expenseDetails.length} out of ${props.totalCount} `;
    }
    if (props.selectedExpenseDetailsId) {
        if(alertText !== '') alertText += "and "
        alertText += `Number of selected records = ${props.selectedExpenseDetailsId.length}`
    }

    return (
        <>
        {
            alertText && 
            <Row>
                <Col>
                    <Alert variant="info" className="text-center py-1 px-2 small">
                        {alertText}
                    </Alert>
                </Col>
            </Row>
        }
        <Table hover bordered size="sm" responsive="sm">
            <thead>
                <tr>
                    { (props.onSelect && props.selectedExpenseDetailsId) &&
                    <th>
                        <Form.Check type="checkbox" 
                        onChange={e => handleCheckBoxChange(e, props.expenseDetails)}
                        checked={props.expenseDetails.length === props.selectedExpenseDetailsId.length}
                        id="checkbox-all" label="" />
                    </th>
                    }
                    <th>#</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Description</th>
                    <th>Expense Type</th>
                    <th>Adjusment</th>
                    <th>Id</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.expense && <ExpenseDetailAddRow expense={props.expense} onAdd={props.onAdd}/>
                }
                {
                    props.expenseDetails && props.expenseDetails.filter(elem => {
                        if(!props.searchFilter) return true;
                        switch(props.searchFilter.name) {
                            case "expenseType":
                                return props.searchFilter.value.toString() === elem.expenseTypeId+'';
                            case "adjusment":
                                return props.searchFilter.value === elem.expenseAdjusment;
                            case "negative":
                                return elem.expenseAmount < 0;
                            default:
                                return true;
                        } 
                    }).map((elem, index) => {
                        return (
                            <ExpenseDetailRow key={elem.expenseDetailId}
                                expenseDetail={elem} 
                                onDelete={props.onDelete}
                                onEdit={props.onEdit} index={index+1} {...props}/>
                        )
                    })
                }
            </tbody>
        </Table>
        </>
    );
}

export default ExpenseDetailTable;