import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function BillItemsTable (props) {
    return (
        <Table hover bordered size="sm" responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Id</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              props.billItems && props.billItems.map( (billItem, index) => {
                return (
                  <tr key={billItem.billItemId}>
                     <td>{index+1}</td>
                    <td>
                      <Form.Control type="input" size="sm" value={billItem.billItemName}
                      name={billItem.billItemId} 
                      onChange={e => props.onItemChange(index, e)} maxLength={35}/>
                    </td>
                    <td>{billItem.billItemId}</td>
                    <td>
                      <Button variant="danger" size="sm"
                      onClick={e => props.onItemDelete(index, billItem.billItemId)}>Delete</Button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
    )
  }
  
  BillItemsTable.propTypes = {
    billItems: PropTypes.array,
    onItemChange: PropTypes.func,
    onItemDelete: PropTypes.func
  };
  
  BillItemsTable.defaultProps = {
    billItems: [],
    onItemChange: () => {},
    onItemDelete: () => {},
  }

  export default BillItemsTable;