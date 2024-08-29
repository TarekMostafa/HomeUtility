import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

//import amountFormatter from '../../utilities/amountFormatter';
import cardNumberFormatter from '../../utilities/cardNumberFormatter';

function CardTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bank Name</th>
          <th>Card Number</th>
          <th>Currency</th>
          <th>Limit</th>
          <th>Balance</th>
          <th>Consumption</th>
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
              <td>{card.bankName}</td>
              <td>{cardNumberFormatter(card.cardNumber)}</td>
              <td>{card.cardCurrency}</td>
              <td className="text-right">
                {/* {amountFormatter(card.cardLimit, card.currencyDecimalPlace)} */}
                {card.cardLimitFormatted}
              </td>
              <td className="text-right">
                {/* {amountFormatter(card.cardBalance, card.currencyDecimalPlace)} */}
                {card.cardBalanceFormatted}
              </td>
              <td className="text-right">
                {/* {amountFormatter(card.cardLimit - card.cardBalance, card.currencyDecimalPlace)} */}
                {card.cardConsumptionFormatted}
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
                <DropdownButton id="dropdown-basic-button" title="Actions"
                  size="sm" variant="primary">
                  <Dropdown.Item onClick={() => props.onEditCard(card.cardId)}>
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => props.onDeleteCard(card.cardId)}>
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

export default CardTable;
