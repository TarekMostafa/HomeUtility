import React from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

function EditCancelButton(props){
  return (
    <Row>
      <Col>
        <Button variant="primary" size="sm"
        onClick={props.onEditClick} disabled={props.disabled}>
        {
          props.isLoading?
          <Spinner as="span" animation="border" size="sm" role="status"
          aria-hidden="true"/> : props.editMode?'Save':'Edit'
        }
        </Button>
      </Col>
      <Col>
        {
          props.editMode &&
          <Button variant="secondary" size="sm"
          onClick={props.onCancelClick} disabled={props.disabled}>
          Cancel
          </Button>
        }
      </Col>
    </Row>
  )
}

EditCancelButton.propTypes = {
  onEditClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  editMode: PropTypes.bool
}

EditCancelButton.defaultProps = {
  disabled: false,
  isLoading: false,
  editMode: false
}

export default EditCancelButton;
