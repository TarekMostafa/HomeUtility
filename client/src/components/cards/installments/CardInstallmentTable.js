import React from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function CardInstallmentTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Card Number</th>
          <th>Currency</th>
          <th>Item</th>
          <th>Purchase Date</th>
          <th>First Inst Date</th>
          <th>Number of Inst</th>
          <th>Price</th>
          <th>Paid</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.cardsInstallments && props.cardsInstallments.map( (inst, index) => {
          return (
            <tr key={inst.cInstId}>
              <td>{index+1}</td>
              <td>{inst.card.cardNumber}</td>
              <td>{inst.cInstCurrency}</td>
              <td>{inst.cInstItemDesc}</td>
              <td>
                {moment(inst.cInstPurchaseDate).format('DD/MM/YYYY')}
              </td>
              <td>
                {
                    inst.cInstFirstInstDate ?
                    moment(inst.cInstFirstInstDate).format('DD/MM/YYYY'):""
                }
              </td>
              <td>{inst.cInstNoOfInst}</td>
              <td className="text-right">
                {amountFormatter(inst.cInstPrice, inst.currency.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(inst.cInstPaid, inst.currency.currencyDecimalPlace)}
              </td>
              <td>
                <ButtonGroup>
                  <Button variant="link" size="sm"
                  onClick={() => props.onEditCardInst(inst.cInstId)}>Edit</Button>
                  <Button variant="link" size="sm"
                  onClick={() => props.onDeleteCardInst(inst.cInstId)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CardInstallmentTable;
