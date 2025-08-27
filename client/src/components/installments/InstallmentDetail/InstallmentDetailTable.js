import React from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import moment from 'moment';

function InstallmentDetailTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Check Number</th>
          <th>Paid Date</th>
          <th>Notes</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.installmentDetails && props.installmentDetails.map( (instDet, index) => {
          return (
            <tr key={instDet.instDetId} className={instDet.instDetStatus==="PAID"?"table-success":""}>
              <td>{index+1}</td>
              <td>{moment(instDet.instDetDate).format('DD/MM/YYYY')}</td>
              <td className="text-right">
                {instDet.instDetAmountFormatted}
              </td>
              <td>{instDet.instDetCurrency}</td>
              <td>{instDet.instDetStatus}</td>
              <td>{instDet.instDetCheckNumber}</td>
              <td>{instDet.instDetPaidDate?moment(instDet.instDetPaidDate).format('DD/MM/YYYY'):""}</td>
              <td>{instDet.instDetNotes}</td>
              <td>{instDet.instDetId}</td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="secondary">
                  {
                    props.installment.instStatus === 'ACTIVE' &&
                    <React.Fragment>
                      <Dropdown.Item onClick={() => props.onInstallmentDetailEdit(instDet.instDetId)}>
                      Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.onInstallmentDetailDelete(instDet.instDetId)}>
                      Delete
                      </Dropdown.Item>
                    </React.Fragment>
                  }
                    <Dropdown.Item onClick={() => props.onInstallmentDetailView(instDet.instDetId)}>
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

export default InstallmentDetailTable;