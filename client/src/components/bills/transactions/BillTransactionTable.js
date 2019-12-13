import React from 'react';
import { Table, DropdownButton, Dropdown, OverlayTrigger, 
  Tooltip, Badge, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function BillTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Bill Name</th>
          <th>Bill Date</th>
          <th>Amount</th>
          <th>Amount Type</th>
          <th>Posting Date</th>
          <th>Notes</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.transactions && props.transactions.map( (transaction, index) => {
          return (
            <tr key={transaction.transId}>
              <td>{index+1}</td>
              <td>{transaction.bill.billName}</td>
              <td>
                <Row>
                  <Col>
                    {moment(transaction.transBillDate).format('DD/MM/YYYY')}
                  </Col>
                  <Col>
                    {
                    transaction.transOutOfFreq ? 
                    <Badge variant='info'>Out Of Frequency</Badge> : null
                    } 
                  </Col>
                </Row>
              </td>
              <td>{amountFormatter(transaction.transAmount, transaction.currency.currencyDecimalPlace)}</td>
              <td>{transaction.transAmountType}</td>
              <td>{moment(transaction.transPostingDate).format('DD/MM/YYYY')}</td>
              <td>
                <OverlayTrigger placement="right"
                  delay={{ show: 250, hide: 400 }} overlay={(
                    <Tooltip>{transaction.transNotes}</Tooltip>
                  )}>
                  <span className="textEllipsis">
                    {transaction.transNotes}
                  </span>
                </OverlayTrigger>
              </td>
              <td>{transaction.transId}</td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions"
                  size="sm" variant="secondary">
                    <Dropdown.Item onClick={() => props.onViewBillTransaction(transaction.transId)}>
                      View
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => props.onEditBillTransaction(transaction.transId)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => props.onDeleteBillTransaction(transaction.transId)}>
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

export default BillTransactionTable;
