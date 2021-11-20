import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

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
            setCardPayments([]);
        });

    useEffect(()=>{
        loadCards();
    },[])

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

    const getTotalPayment = () => {
        var total = cardPayments.reduce( (prv, current) => prv += Number(current.cardTransBillAmount), 0);
        return Number(total).toFixed(formData.decimalPlaces);
    }

    const handlePayClick = () => {
        if(Number(getTotalPayment()) === 0) {
            setFormData({...formData, message: 'No payment is selected'});
            return;
        } else {
            setFormData({...formData, message: ''});
            setModalShow({name:"Pay"})
        }
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
                        <CardsDropDown cards={cards}/>
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control size="sm" type="text" 
                        value={`Total Payment = ${getTotalPayment()} ${formData.cardCurrency}`} readOnly/>
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
                <CardTransactionPaymentTable 
                    appearPayCol
                    cardTransactions={cardTransactions}
                    onPay={handleOnPay}/>
            </FormContainer>
            {
                modalShow.name==='Pay' && 
                <CardTransactionPaymentModal 
                show={modalShow.name==='Pay'} 
                onHide={()=>setModalShow({name:""})}
                onPay={()=>loadCardTransactions(formData.cardId)}
                cardTransactions={cardPayments}
                cardId={formData.cardId}
                />
            }
        </React.Fragment>
    )
}

export default CardTransactionPaymentList;
