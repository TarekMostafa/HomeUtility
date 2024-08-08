import React from 'react';
import { Table, OverlayTrigger, Tooltip, DropdownButton, 
  Dropdown, Button, Badge } from 'react-bootstrap';
import moment from 'moment';
import '../../../App.css';
import amountFormatter from '../../../utilities/amountFormatter';

// function IsModuleAllowed(module) {
//   return [null,'DBT'].includes(module);
// }

function WealthTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Account Number</th>
          <th>Posting Date</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Credit/Debit</th>
          <th>Type Name</th>
          <th>Narrative</th>
          <th>Id</th>
          <th>Mod</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          props.transactions && props.transactions.map( (transaction, index) => {
            let isEditable = transaction.isEditable
            && props.onEditTransaction; 
            let isDeletable = transaction.isDeletable
            && props.onDeleteTransaction;
            let isMigrable = transaction.migrationType
            && props.onMigration;
          return (
            <tr key={transaction.transactionId}>
              <td>{index+1}</td>
              <td>{transaction.accountNumber}</td>
              <td>{moment(transaction.transactionPostingDate).format('DD/MM/YYYY')}</td>
              <td className="text-right">
                {amountFormatter(transaction.transactionAmount, transaction.currencyDecimalPlace)}
              </td>
              <td>{transaction.accountCurrency}</td>
              <td>{transaction.transactionCRDR}</td>
              <td>{transaction.typeName}</td>
              <td>
                <OverlayTrigger placement="right"
                  delay={{ show: 250, hide: 400 }} overlay={(
                    <Tooltip>{transaction.transactionNarrative}</Tooltip>
                  )}>
                  <span className="textEllipsis">
                    {transaction.transactionNarrative}
                  </span>
                </OverlayTrigger>
              </td>
              <td>
                {transaction.transactionId}
                {
                  transaction.transactionRelatedTransactionId &&
                  <Button variant="link"
                  onClick={() => props.onRelatedTransaction(transaction.transactionRelatedTransactionId)}>
                    <Badge pill variant="success">
                      {transaction.transactionRelatedTransactionId}
                    </Badge>
                  </Button>
                }
              </td>
              <td>
                {
                  transaction.transactionModule &&
                  <Badge pill variant="info">
                    {transaction.transactionModule}
                  </Badge>
                }
              </td>
              <td>
                {
                  // (!transaction.transactionModule || transaction.transactionModule === 'DBT')  &&
                  // <ButtonGroup>
                  //   {props.onEditTransaction && <Button variant="link" size="sm"
                  //   onClick={() => props.onEditTransaction(transaction.transactionId, 
                  //   transaction.transactionModule)}>Edit</Button>}
                  //   {props.onDeleteTransaction && <Button variant="link" size="sm"
                  //   onClick={() => props.onDeleteTransaction(transaction.transactionId, 
                  //   transaction.transactionModule)}>Delete</Button>}
                  //   {
                  //     props.onMigration && transaction.migrationType &&
                  //     <Button variant="link" size="sm"
                  //     onClick={() => props.onMigration(transaction)}>
                  //       {transaction.migrationText}
                  //     </Button>
                  //   }
                  // </ButtonGroup>
                  //(isEditable || isDeletable || isMigrable) &&
                  <DropdownButton id="dropdown-basic-button" title="Actions"
                  size="sm" variant="secondary">
                    {
                      isEditable &&
                      <Dropdown.Item onClick={() => props.onEditTransaction(transaction.transactionId, 
                        transaction.transactionModule)}>
                      Edit
                      </Dropdown.Item>
                    }
                    {
                      isDeletable &&
                      <Dropdown.Item onClick={() => props.onDeleteTransaction(transaction.transactionId, 
                        transaction.transactionModule)}>
                      Delete
                      </Dropdown.Item>
                    }
                    <Dropdown.Item onClick={() => props.onViewTransaction(transaction.transactionId, 
                        transaction.transactionModule)}>
                      View
                    </Dropdown.Item>
                    {
                      isMigrable &&
                      <Dropdown.Item onClick={() => props.onMigration(transaction)}>
                      {transaction.migrationText}
                      </Dropdown.Item>
                    }
                  </DropdownButton>
                }
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WealthTransactionTable;
