import React, {useState, useEffect} from 'react';
import { Button, Form, Container, CardColumns} from 'react-bootstrap';

import FormContainer from '../common/FormContainer';
import ExpenseHeaderCard from './ExpenseHeaderCard';
import ExpenseHeaderAddModal from './ExpenseHeaderAddModal';
import ExpenseHeaderEditModal from './ExpenseHeaderEditModal';
import ExpenseRequest from '../../axios/ExpenseRequest';

function ExpenseHeaderList(props) {

    const minYear = 2015;
    const currentYear = new Date().getFullYear()

    const [year, setYear] = useState(currentYear);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [expenses, setExpenses] = useState([]);

    const handleDetails = (expense) => {
        props.history.push({pathname:'/expenseDetailList/'+expense.expenseId});
    }

    const handleEdit = (id) => {
        setModalEdit({show: true, id});
    }

    const loadExpenses = () => ExpenseRequest.getExpenses(year).then(expenses => setExpenses(expenses));

    useEffect(()=>{
        loadExpenses();
    },[year])

    return (
        <React.Fragment>
            <FormContainer title="Expenses" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
                    Create New Expense</Button>
            }>
                <Form.Group controlId="accountBank">
                    <Form.Label>Expense Year</Form.Label>
                    <Form.Control as="select" name="expenseYear" value={year} 
                    onChange={e => setYear(e.target.value)}>
                    {
                        Array(currentYear - minYear + 1).fill().map((elem,index,arr) => {
                            const val = minYear + arr.length - index - 1;
                            return <option key={val} value={val+''}>{val}</option>
                        })
                    }
                    </Form.Control>
                </Form.Group>
                <Container fluid><CardColumns>
                {
                    expenses.map(
                        expense => {
                            return <ExpenseHeaderCard 
                                key={expense.expenseId} expense={expense} 
                                onDetails={() => handleDetails(expense)}
                                onEdit={() => handleEdit(expense.expenseId)}>
                                </ExpenseHeaderCard>
                        })
                }
                </CardColumns></Container>
            </FormContainer>
            <ExpenseHeaderAddModal 
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadExpenses()}
            />
            <ExpenseHeaderEditModal
                expenseId={modalEdit.id}
                show={modalEdit.show}
                onHide={()=>setModalEdit({show: false, id: 0})}
                onSave={()=>loadExpenses()}
            />
        </React.Fragment>
    );
}
  
  
export default ExpenseHeaderList;
  