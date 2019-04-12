import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

function AlertError(props) {
  return(
    <React.Fragment>
      {props.message &&
      <Alert variant="danger">{props.message}</Alert>}
    </React.Fragment>
  )
}

AlertError.propTypes = {
  message: PropTypes.string
}

export default AlertError;
