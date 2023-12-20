import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import CardsDropDown from '../CardsDropDown';
import CardTransactionPaymentTable from './CardTransactionPaymentTable';
import CardTransactionPaymentModal from './CardTransactionPaymentModal';

import CardRequest from '../../../axios/CardRequest';
import CardTransRequest from '../../../axios/CardTransRequest';

const initialState = {
    cardId: "",
    decimalPlaces: 0,
    cardCurrency: "",
    message: ""
}

function CardTransactionPaymentList(props) {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [cardTransactions, setCardTransactions] = useState([]);
    const [cardPayments, setCardPayments] = useState([]);
    const [modalShow, setModalShow] = useState({name:""});

    const loadCards = () => 
        CardRequest.getCards()
        .then(cards => setCards(cards));

    const loadCardTransactions = (cardId) => 
        CardTransRequest.getCardsTransactions(cardId, undefined, true, false, 0, 1000)
        .then(cardsTrans => {
            setCardTransactions(cardsTrans);
        });

    useEffect(()=>{
        loadCards();
    },[])

    useEffect(()=>{
        let tmpCardPayment = [...cardPayments];
        tmpCardPayment = tmpCardPayment.filter(pay => 
            cardTransactions.some(cardTrans=>cardTrans.cardTransId===pay.cardTransId));
        setCardPayments(tmpCardPayment);
    },[cardTransactions])

    const handleCardChange = (event) => {
        const cardId = event.target.value;
        const decimalPlaces = event.target[event.target.selectedIndex].getAttribute('decimalplaces');
        const cardCurrency = event.target[event.target.selectedIndex].getAttribute('currencycode');
        setFormData({
            ...formData,
            cardId,
            decimalPlaces,
            cardCurrency
        });
        if(cardId) loadCardTransactions(cardId);
        else {
            setCardTransactions([]);
            setCardPayments([]);
        }
    }

    const handleOnPay = (isPaid, trans) => {
        if(isPaid) {
            //add payment
            setCardPayments([...cardPayments, trans]);
        } else {
            //remove payment
            let tmpCardPayment = [...cardPayments];
            tmpCardPayment = tmpCardPayment.filter(pay => pay.cardTransId !== trans.cardTransId);
            setCardPayments(tmpCardPayment);
        }
    }

    const getTotalSelectedPayment = () => {
        var total = cardPayments.reduce( (prv, current) => prv += Number(current.cardTransBillAmount), 0);
        return Number(total).toFixed(formData.decimalPlaces);
    }

    const getTotalPayment = () => {
        var total = cardTransactions.reduce( (prv, current) => prv += Number(current.cardTransBillAmount), 0);
        return Number(total).toFixed(formData.decimalPlaces);
    }

    const handlePayClick = () => {
        if(cardPayments.length === 0) {
            setFormData({...formData, message: 'No payment is selected'});
            return;
        } else if(!cardPayments.every(pay=> pay.cardTransBillAmount < 0) &&
          !cardPayments.every(pay=> pay.cardTransBillAmount > 0)) {
            setFormData({...formData, message: 'We Can not process mixed of credit or debit together'});
            return;    
        } else {
            setFormData({...formData, message: ''});
            setModalShow({name:"Pay"})
        }
    }

    const handleModalOnHideClick = () => {
        setModalShow({name:""});
        loadCardTransactions(formData.cardId);
    }

    return (
        <React.Fragment>
            <FormContainer title="Card Payments">
                <Form>
                    <Row>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardId"
                        onChange={handleCardChange}
                        value={formData.cardId}>
                        <option value=''>Cards</option>
                        <CardsDropDown cards={cards} status={"ACTIVE"}/>
                        </Form.Control>
                    </Col>
                    <Col xs={1}>
                        <Button variant="success" size="sm" block onClick={handlePayClick}>
                            Pay
                        </Button>
                    </Col>
                    <Col>
                        <Form.Text className='text-danger'>{formData.message}</Form.Text>
                    </Col>
                    </Row>
                </Form>
            </FormContainer>
            <FormContainer>
                <Row>
                    <Col xs={{span:4, offset:4}}>
                        <h4>
                            <Badge variant="primary">
                            {`Total Selected Payment: ${getTotalSelectedPayment()} 
                            / ${getTotalPayment()} 
                            ${formData.cardCurrency?formData.cardCurrency:""}`}
                            </Badge>
                        </h4>
                    </Col>
                </Row>
                <CardTransactionPaymentTable 
                    appearPayCol
                    cardTransactions={cardTransactions}
                    onPay={handleOnPay}/>
            </FormContainer>
            {
                modalShow.name==='Pay' && 
                <CardTransactionPaymentModal 
                show={modalShow.name==='Pay'} 
                onHide={handleModalOnHideClick}
                onPay={()=>loadCardTransactions(formData.cardId)}
                cardTransactions={cardPayments}
                cardId={formData.cardId}
                />
            }
        </React.Fragment>
    )
}

export default CardTransactionPaymentList;
