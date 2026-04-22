import React, { Component } from 'react';
import { Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import ModalContainer from '../../common/ModalContainer';
import TransactionRequest from '../../../axios/TransactionRequest';
import ViewSingleTransactionData from './ViewSingleTransactionData';
import BillDropDown from '../../bills/summary/BillsDropDown';
import BillTransactionListModal from '../../bills/transactions/BillTransactionListModal';

const initialState = {
  bill: '',
  billTransId: 0,
  account: '',
  postingDate: '',
  amount: '0',
  crdr: 0,
  type: '',
  narrative: '',
  accountCurrencyDecimalPlaces: 0,
  currency: '',
  message: '',
  isLoading: false,
  modalBillSearchShow: false,
}

class AddTransactionToBillTransactionModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.transactionId)
      return;
    TransactionRequest.getSingleTransaction(this.props.transactionId)
    .then( (transaction) => {
      this.setState({
        account: transaction.transactionAccount,
        postingDate: transaction.transactionPostingDate,
        amount: transaction.transactionAmountFormatted,
        crdr: transaction.transactionCRDR,
        type: transaction.transactionTypeId,
        narrative: transaction.transactionNarrative,
        accountCurrencyDecimalPlaces: transaction.currencyDecimalPlace,
        currency: transaction.accountCurrency,
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading transaction information'});
    })
  }

  render () {
    return (
      <ModalContainer title="Add Transaction To Bill Transaction" show={this.props.show}
        onHide={this.props.onHide} onShow={this.handleOnShow}
        footer={
          <Button variant="primary" block onClick={this.handleClick}>
          {
            this.state.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Add to Bill Transaction'
          }
          </Button>
        }>
          {
            <React.Fragment>
              <Row>
                <Col xs={9}>
                  <Form>
                    <Form.Group controlId="bills">
                      <Form.Label>Bill</Form.Label>
                      <Form.Control as="select" name="bill" onChange={this.handleChange}
                      value={this.state.bill}>
                        <option value=''></option>
                        <BillDropDown status="ACTIVE"/>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Col>
                <Col xs={3}>
                  <Form>
                    <Form.Group controlId="billTransId">
                      <Form.Label>Bill Trans. Id</Form.Label>
                      <InputGroup>
                        <Form.Control type="input"
                        name="billTransId"
                        value={this.state.billTransId}
                        readOnly/>
                        <InputGroup.Prepend>
                          <Button variant="secondary" onClick={this.handleSearchClick}>...</Button>
                        </InputGroup.Prepend>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <ViewSingleTransactionData data={this.state}/>
            </React.Fragment>
          }
          {
            this.state.modalBillSearchShow && 
              <BillTransactionListModal show={this.state.modalBillSearchShow} onHide={this.handleHide}
              onSelect={this.handleSelectClick} bill={this.state.bill} amountType={this.state.crdr}/>
          }
      </ModalContainer>
    )
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

  handleHide = () => {
    this.setState({
      modalBillSearchShow: false,
      billTransId: 0,
      isLoading: false,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : (event.target.type === "checkbox" ? event.target.checked : event.target.value)
    })
  }

  handleSearchClick = () => {
    // Validate Input
    if(!this.state.bill) {
      this.setState({message: 'Invalid bill, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
        modalBillSearchShow: true,
      });
    }
  }

  handleSelectClick = (transId) => {
    this.setState({
      modalBillSearchShow: false,
      billTransId: transId,
      isLoading: false,
    });
  }

  handleClick = () => {
    // Validate Input
    if(!this.state.bill) {
      this.setState({message: 'Invalid bill, should not be empty'});
      return;
    } else {
      this.setState({
        message: '',
        isLoading: true,
      });
    }
    // add transaction to bill transaction
    TransactionRequest.addTransactionToBillTransaction(
      this.props.transactionId, this.state.bill, this.state.billTransId)
    .then( (response) => {
      if (typeof this.props.onSave=== 'function') {
        this.props.onSave();
      }
      this.setState({isLoading: false});
      this.props.onHide();
    })
    .catch( err => {
      this.setState({
        message: err.response.data,
        isLoading: false,
      })
    })
  }
}

export default AddTransactionToBillTransactionModal;
