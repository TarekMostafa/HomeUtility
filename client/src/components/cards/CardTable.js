import React from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../utilities/amountFormatter';

function CardTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Card Number</th>
          <th>Currency</th>
          <th>Card Limit</th>
          <th>Card Balance</th>
          <th>Start Date</th>
          <th>Expiry Date</th>
          <th>Status</th>
          <th>Balance Last Update</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.cards && props.cards.map( (card, index) => {
          return (
            <tr key={card.cardId} className={card.cardStatus==="CLOSED"?"table-danger":""}>
              <td>{index+1}</td>
              <td>{card.bank.bankName}</td>
              <td>{card.cardNumber}</td>
              <td>{card.cardCurrency}</td>
              <td className="text-right">
                {amountFormatter(card.cardLimit, card.currency.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(card.cardBalance, card.currency.currencyDecimalPlace)}
              </td>
              <td>
                {moment(card.cardStartDate).format('DD/MM/YYYY')}
              </td>
              <td>
                {moment(card.cardExpiryDate).format('DD/MM/YYYY')}
              </td>
              <td>{card.cardStatus}</td>
              <td>
                {
                  card.cardLastBalanceUpdate ?
                  moment(card.cardLastBalanceUpdate).format('DD/MM/YYYY HH:mm:ss') :
                  ''
                }
              </td>
              <td>
                <ButtonGroup>
                  <Button variant="link" size="sm"
                  onClick={() => props.onEditCard(card.cardId)}>Edit</Button>
                  <Button variant="link" size="sm"
                  onClick={() => props.onDeleteCard(card.cardId)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CardTable;
