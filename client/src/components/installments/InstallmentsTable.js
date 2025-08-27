import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

function InstallmentTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Inst Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Entered</th>
          <th>Paid</th>
          <th>Last Paid Date</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.installments && props.installments.map( (inst, index) => {
          return (
            <tr key={inst.instId} className={inst.instStatus==="CLOSED"?"table-warning":""}>
              <td>{index+1}</td>
              <td>{inst.instName}</td>
              <td>{moment(inst.instStartDate).format('DD/MM/YYYY')}</td>
              <td>{moment(inst.instEndDate).format('DD/MM/YYYY')}</td>
              <td className="text-right">
                {inst.instAmountFormatted}
              </td>
              <td>{inst.instCurrency}</td>
              <td>{inst.instStatus}</td>
              <td className="text-right">
                {inst.instEnteredAmountFormatted}
              </td>
              <td className="text-right">
                {inst.instPaidAmountFormatted}
              </td>
              <td>{inst.instLastPaidUpdate}</td>
              <td>{inst.instId}</td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="secondary">
                  <Dropdown.Item onClick={() => props.onInstallmentDetails(inst.instId)}>
                  Details
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => props.onInstallmentEdit(inst.instId)}>
                  Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => props.onInstallmentDelete(inst.instId)}>
                  Delete
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => props.onInstallmentView(inst.instId)}>
                  View
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

export default InstallmentTable;