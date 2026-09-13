import React from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';

// import amountFormatter from '../../../utilities/amountFormatter';

function CardTransactionPaymentRow (props) {

    const trans = props.cardTransaction;

    const handleCheckBoxChange = (event) => {
        if (typeof props.onSelect=== 'function') props.onSelect(event.target.checked, trans)
    }

    return (
        <tr key={trans.cardTransId}>
            <td>{props.index+1}</td>
            <td className="text-right">
                {/* {amountFormatter(trans.cardTransAmount, trans.currencyDecimalPlace)} */}
                {trans.cardTransAmountFormatted}
            </td>
            <td>{trans.cardTransCurrency}</td>
            <td>
                {moment(trans.cardTransDate).format('DD/MM/YYYY')}
            </td>
            <td>{trans.cardTransDesc}</td>
            <td className="text-right">
                {/* {amountFormatter(trans.cardTransBillAmount, trans.cardCurrencyDecimalPlace)} */}
                {trans.cardTransBillAmountFormatted}
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
                        checked={props.isSelected}
                    />
                    </Form>
                </td>
            }
            
        </tr>
    )
}

export default CardTransactionPaymentRow;
