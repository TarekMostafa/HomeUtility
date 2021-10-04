import React, {useState, useEffect} from 'react';
import { Button, Form } from 'react-bootstrap';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';

function ExpenseHeaderList(props) {

    const [year, setYear] = useState(new Date().getFullYear());

    const handleEdit = (expense) => {
        props.history.push({pathname:'/expenseDetailList',expense});
    }

    useEffect(()=>{

    },[])

    return (
        <FormContainer title="Expenses" toolbar={
            <Button variant="info" size="sm">Create New Expense</Button>
        }>
            <Form.Group controlId="accountBank">
                <Form.Label>Expense Year</Form.Label>
                <Form.Control as="select" name="expenseYear" value={year} 
                onChange={e => setYear(e.target.value)}>
                    <option value='2021'>2021</option>
                    <option value='2020'>2020</option>
                </Form.Control>
            </Form.Group>
            {
                [12,11,10,9,8,7,6,5,4,3,2,1].map(
                    elem => {
                        const expense = {
                            year, 
                            month:elem, 
                            currency:'EGP',
                            openBalance: 123456.780,
                            closeBalance: 135670.120,
                            adjusments: 123123.120,
                            debits: 234678.344,
                            status: 'ACTIVE'
                        }
                        return <ExpenseHeaderCard key={elem} expense={expense}
                        onEdit={() => handleEdit(expense)}></ExpenseHeaderCard>
                    })
            }
        </FormContainer>
    );
}
  
  
export default ExpenseHeaderList;
  