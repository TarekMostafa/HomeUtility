import React from 'react';
import { Table, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import amountFormatter from '../../../utilities/amountFormatter';

function BillTransDetailTable (props) {
    return (
      <Table hover bordered size="sm" responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Id</th>
            {
              props.onRemove && <th></th>
            }
          </tr>
        </thead>
        <tbody>
          {props.transDetails && props.transDetails.map( (transDetail, index) => {
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{transDetail.billItem.billItemName}</td>
                    <td>{amountFormatter(transDetail.detAmount, props.currencyDecimalPlace)}</td>
                    <td>{transDetail.detQuantity}</td>
                    <td>{transDetail.detAmountType}</td>
                    <td>{transDetail.billItemId}</td>
                    {
                      props.onRemove &&
                      <td>
                        <Button variant="link" size="sm" onClick={() => props.onRemove(index)}>
                          Remove
                        </Button>
                      </td>
                    }
                </tr>
            )
          })}
        </tbody>
      </Table>
    )
}

BillTransDetailTable.propTypes = {
  onRemove: PropTypes.func,
};

BillTransDetailTable.defaultProps = {
  onRemove: null,
}

export default BillTransDetailTable;