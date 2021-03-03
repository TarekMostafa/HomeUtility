import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

function EditDeleteButton(props){
  return (
    <React.Fragment>
      {
        props.mode === 'Edit' &&
        <React.Fragment>
          <Button variant="primary" size="sm" onClick={props.onEditClick} disabled={props.disabled}>
            {
              props.isLoading?
              <Spinner as="span" animation="border" size="sm" role="status"
              aria-hidden="true"/> : 'Update'
            }
          </Button>{' '}
          <Button variant="secondary" size="sm" onClick={props.onCancelClick} disabled={props.disabled}>
            Cancel
          </Button>
        </React.Fragment>
      }
      {
        props.mode === 'Delete' &&
        <React.Fragment>
          <Button variant="danger" size="sm" onClick={props.onDeleteClick} disabled={props.disabled}>
            {
              props.isLoading?
              <Spinner as="span" animation="border" size="sm" role="status"
              aria-hidden="true"/> : 'Confirm Deletion'
            }
          </Button>{' '}
          <Button variant="secondary" size="sm" onClick={props.onCancelClick} disabled={props.disabled}>
            Cancel
          </Button>
        </React.Fragment>
      }
      {
        props.mode === 'None' &&
        <React.Fragment>
          <Button variant="primary" size="sm" onClick={props.onEditClick} disabled={props.disabled}>
          Edit
          </Button>{' '}
          <Button variant="danger" size="sm" onClick={props.onDeleteClick} disabled={props.disabled}>
          Delete
          </Button>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

EditDeleteButton.propTypes = {
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  mode: PropTypes.oneOf(['None', 'Edit', 'Delete'])
}

EditDeleteButton.defaultProps = {
  disabled: false,
  isLoading: false,
  mode: 'None'
}

export default EditDeleteButton;
