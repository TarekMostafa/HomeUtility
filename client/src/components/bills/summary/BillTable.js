import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

import amountFormatter from '../../../utilities/amountFormatter';

function BillTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Frequency</th>
          <th>Currency</th>
          <th>Start Date</th>
          <th>Status</th>
          <th>Default Amount</th>
          <th>Last Bill Paid Date</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.bills && props.bills.map( (bill, index) => {
          return (
            <tr key={bill.billId} className={bill.billStatus==="CLOSED"?"table-danger":""}>
              <td>{index+1}</td>
              <td>{bill.billName}</td>
              <td>{bill.billFrequency}</td>
              <td>{bill.billCurrency}</td>
              <td>
                {moment(bill.billStartDate).format('DD/MM/YYYY')}
              </td>
              <td>{bill.billStatus}</td>
              <td className="text-right">
                {amountFormatter(bill.billDefaultAmount, bill.currency.currencyDecimalPlace)}
              </td>
              <td>
                {
                  bill.billLastBillPaidDate ?
                  moment(bill.billLastBillPaidDate).format('DD/MM/YYYY') :
                  ''
                }
              </td>
              <td>{bill.billId}</td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions"
                  size="sm" variant="secondary">
                    <Dropdown.Item onClick={() => props.onTransactions(bill.billId)}>
                      Transactions
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => props.onViewBill(bill.billId)}>
                      View
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => props.onEditBill(bill.billId)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => props.onDeleteBill(bill.billId)}>
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

export default BillTable;
