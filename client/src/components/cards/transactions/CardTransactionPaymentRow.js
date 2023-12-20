import React, {useState} from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function CardTransactionPaymentRow (props) {

    const [isSelected, setIsSelected] = useState(false); 
    const trans = props.cardTransaction;

    const handleCheckBoxChange = (event) => {
        setIsSelected(event.target.checked);
        if (typeof props.onPay=== 'function') props.onPay(event.target.checked, trans)
    }

    return (
        <tr key={trans.cardTransId}>
            <td>{props.index+1}</td>
            <td className="text-right">
                {amountFormatter(trans.cardTransAmount, trans.currencyDecimalPlace)}
            </td>
            <td>{trans.cardTransCurrency}</td>
            <td>
                {moment(trans.cardTransDate).format('DD/MM/YYYY')}
            </td>
            <td>{trans.cardTransDesc}</td>
            <td className="text-right">
                {amountFormatter(trans.cardTransBillAmount, trans.cardCurrencyDecimalPlace)}
            </td>
            <td>{trans.cardTransIsInstallment?'YES':'NO'}</td>
            <td>{trans.cardTransId}</td>
            {
                props.appearPayCol && 
                <td>
                    <Form>
                    <Form.Check
                        type='checkbox'
                        id={`checkbox-${trans.cardTransId}`}
                        onChange={handleCheckBoxChange}
                        value={isSelected}
                    />
                    </Form>
                </td>
            }
            
        </tr>
    )
}

export default CardTransactionPaymentRow;
