import React, { Component } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';

import FormContainer from '../common/FormContainer';
import DBRequest from '../../axios/DBRequest';

const initialState = {
  message: '',
  messageClass: '',
  isLoading: false,
}

class DBBackup extends Component {
  state = {
    ...initialState
  }

  render() {
    return (
      <FormContainer title="DB Backup">
        <Row>
          <Col xs={3}>
            <Button variant="primary" size="sm" onClick={this.handleClick}
            disabled={this.state.isLoading}>
            {
              this.state.isLoading?
              <Spinner as="span" animation="border" size="sm" role="status"
              aria-hidden="true"/> : 'Backup database'
            }
            </Button>
          </Col>
        </Row>
      </FormContainer>
    )
  }//end of render

  handleClick = () => {
    this.setState({
      messageClass: 'text-success',
      message: '',
      isLoading: true
    });
    DBRequest.backup()
    .then( () => {
      this.setState({
        messageClass: 'text-success',
        message: 'Database backup is done successfully',
        isLoading: false
      })
    })
    .catch( (err) => {
      this.setState({
        messageClass: 'text-danger',
        message: err.response.data,
        isLoading: false
      })
    })
  }
}

export default DBBackup;
