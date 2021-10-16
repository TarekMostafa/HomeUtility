import React, {useState} from 'react';
import { Form, Card } from 'react-bootstrap';
import MonthYearPicker from 'react-month-year-picker';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getMonthName = (num) => {
    if(num < 1 || num > 12) return "";
    else return months[num-1];
}

function MonthYearField(props){

    const [show, setShow] = useState(false);

    return (
        <React.Fragment>
            <Form.Group controlId={props.name}>
                <Form.Label>{props.label}</Form.Label>
                <Form.Control name={props.name} type="input" readOnly
                onClick={()=>setShow(true)} value={getMonthName(props.month)+'/'+props.year}/>
                {
                    show && <Card bg="light"><Card.Body>
                        <MonthYearPicker 
                            caption=""
                            selectedMonth={props.month}
                            selectedYear={props.year}
                            minYear={2000}
                            maxYear={2100}
                            onChangeYear={y => props.onChangeYear(y)}
                            onChangeMonth={m => {
                                props.onChangeMonth(m);
                                setShow(false);
                            }}
                        />
                    </Card.Body></Card> 
                    
                    
                }
            </Form.Group>
        </React.Fragment>
    );
}

export default MonthYearField;