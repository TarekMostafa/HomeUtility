import React, {useState, useEffect} from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

import ModalContainer from '../../common/ModalContainer';
import CardInstallmentViewForm from './CardInstallmentViewForm';

import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    isLoading: false,
    message: "",
}

function CardInstallmentTerminateModal(props) {

    const [formData, setFormData] = useState(initialState);
    const [cardInstallment, setCardInstallment] = useState(null);

    const loadCardInstallment = (id) => CardInstRequest.getCardInstallment(id)
        .then(cardInst => setCardInstallment(cardInst));

    useEffect(()=>{
        if(props.cardInstId) loadCardInstallment(props.cardInstId);
    },[props.cardInstId])

    const handleClick = () => {
      setFormData({...formData, message: "", isLoading: true});
      // update card
      CardInstRequest.terminateCardInstallment(cardInstallment.cInstId)                   
      .then( () => {
          if (typeof props.onTerminate=== 'function') {
              props.onTerminate();
          }
          setFormData({...formData, isLoading: false});
          props.onHide();
      })
      .catch( err => {
          setFormData({...formData, message: err.response.data, isLoading: false});
      })
    }

    return (
        <ModalContainer title="Terminate Card Installment" show={props.show}
        onHide={props.onHide} onShow={() => setFormData(initialState)}
        footer={
          <Button variant="warning" block onClick={handleClick}>
          {
            formData.isLoading?
            <Spinner as="span" animation="border" size="sm" role="status"
            aria-hidden="true"/> : 'Terminate'
          }
          </Button>
        }>
        {
          cardInstallment && 
          <form>
            <CardInstallmentViewForm cards={props.cards} cardInstallment={cardInstallment}/>
            <Form.Text className='text-danger'>{formData.message}</Form.Text>
          </form>
        }
        </ModalContainer>
    );
}

export default CardInstallmentTerminateModal;