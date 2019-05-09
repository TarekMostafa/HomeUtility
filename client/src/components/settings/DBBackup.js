import React, { Component } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';

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
          <Col>
            <Form.Text className={this.state.messageClass}>{this.state.message}</Form.Text>
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
    .then( (response) => {
      this.setState({
        messageClass: 'text-success',
        message: response.data,
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
