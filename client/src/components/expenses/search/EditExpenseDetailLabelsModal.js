import React, { Component } from 'react';
import ModalContainer from '../../common/ModalContainer';
import ExpenseDetailRequest from '../../../axios/ExpenseDetailRequest';
import AddExpenseDetailLabels from './AddExpenseDetailLabels';

const initialState = {
  message: '',
  isLoading: false,
  labels: null,
}

class EditExpenseDetailLabelsModal extends Component {
  state = {
    ...initialState
  }

  componentDidMount() {
    if(!this.props.expenseDetailId)
      return;
    ExpenseDetailRequest.getExpenseDetail(this.props.expenseDetailId)
    .then( (expenseDetail) => {
      this.setState({
        labels: {
            label1: expenseDetail.expenseLabel1,
            label2: expenseDetail.expenseLabel2,
            label3: expenseDetail.expenseLabel3,
            label4: expenseDetail.expenseLabel4,
            label5: expenseDetail.expenseLabel5,
        },
      });
    })
    .catch( (err) => {
      this.setState({message: 'Error occured while loading expense detail information'});
    })
  }

  render () {
    return (
      <ModalContainer title={"Expense Detail Labels (" + this.props.expenseDetailId + ")"} 
      show={this.props.show} onHide={this.props.onHide} onShow={this.handleOnShow}>
          {
            <AddExpenseDetailLabels expenseDetailId={this.props.expenseDetailId} 
              labels={this.state.labels} {...this.props}/>
          }
      </ModalContainer>
    );
  }//end of render

  handleOnShow = () => {
    this.setState({
      ...initialState
    })
  }

}

export default EditExpenseDetailLabelsModal;