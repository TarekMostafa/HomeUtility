import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function CardTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Card</th>
          <th>Trans Amount</th>
          <th>Trans Currency</th>
          <th>Trans Date</th>
          <th>Trans Desc</th>
          <th>Bill Amount</th>
          <th>Bill Date</th>
          <th>Is Installment?</th>
          <th>Is Paid?</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.cardsTransactions && props.cardsTransactions.map( (trans, index) => {
          return (
            <tr key={trans.cardTransId}>
              <td>{index+1}</td>
              <td>{trans.card.cardNumber} - {trans.card.bank.bankName} - {trans.card.cardCurrency}</td>
              <td className="text-right">
                {amountFormatter(trans.cardTransAmount, trans.currency.currencyDecimalPlace)}
              </td>
              <td>{trans.cardTransCurrency}</td>
              <td>
                {moment(trans.cardTransDate).format('DD/MM/YYYY')}
              </td>
              <td>{trans.cardTransDesc}</td>
              <td className="text-right">
                {amountFormatter(trans.cardTransBillAmount, trans.card.currency.currencyDecimalPlace)}
              </td>
              <td>
                {
                    trans.cardTransBillDate ?
                    moment(trans.cardTransBillDate).format('DD/MM/YYYY'):""
                }
              </td>
              <td>{trans.cardTransIsInstallment?'YES':'NO'}</td>
              <td>{trans.cardTransIsPaid?'YES':'NO'}</td>
              <td>{trans.cardTransId}</td>
              <td>
              <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="primary">
              {
                !trans.cardTransIsInstallment &&
                <Dropdown.Item onClick={() => props.onEditCardTrans(trans.cardTransId)}>
                  Edit
                </Dropdown.Item>
              }
                <Dropdown.Item onClick={() => props.onDeleteCardTrans(trans.cardTransId)}>
                  Delete
                </Dropdown.Item>
              </DropdownButton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CardTransactionTable;
