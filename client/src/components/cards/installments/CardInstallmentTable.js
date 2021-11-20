import React from 'react';
import { Table, Dropdown, DropdownButton, Button, Badge } from 'react-bootstrap';
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
          <th>Posted</th>
          <th>Status</th>
          <th>Id</th>
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
              <td>{`${inst.cInstNoOfPostedInst} / ${inst.cInstNoOfInst}`}</td>
              <td className="text-right">
                {amountFormatter(inst.cInstPrice, inst.currency.currencyDecimalPlace)}
              </td>
              <td className="text-right">
                {amountFormatter(inst.cInstPosted, inst.currency.currencyDecimalPlace)}
              </td>
              <td>{inst.cInstStatus}</td>
              <td>
                {inst.cInstId}
                {
                  inst.cInstRelTransId &&
                  <Button variant="link"
                  onClick={() => props.onRelatedTransaction(inst.cInstRelTransId)}>
                    <Badge pill variant="success">
                      {inst.cInstRelTransId}
                    </Badge>
                  </Button>
                }
              </td>
              <td>
              <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="primary">
                  <Dropdown.Item onClick={() => props.onViewCardTransactions(inst.cardId, inst.cInstId)}>
                  View Card Transactions
                  </Dropdown.Item>
                  {
                    inst.cInstStatus !== 'FINISHED' && 
                    <React.Fragment>
                      <Dropdown.Item onClick={() => props.onPostCardInst(inst.cInstId)}>
                      Post Installment
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onTerminateCardInst(inst.cInstId)}>
                      Terminate Installment
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onEditCardInst(inst.cInstId)}>
                      Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onDeleteCardInst(inst.cInstId)}>
                      Delete
                      </Dropdown.Item>
                    </React.Fragment>
                  }
                  
              </DropdownButton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CardInstallmentTable;
