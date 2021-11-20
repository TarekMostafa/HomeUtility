import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import TableLimiterDropDown from '../../common/TableLimiterDropDown';
import CardTransactionTable from './CardTransactionTable';
import CardsDropDown from '../CardsDropDown';
import CardsInstallmentsDropDown from '../installments/CardsInstallmentsDropDown';
import CardTransactionAddModal from './CardTransactionAddModal';
import CardTransactionEditModal from './CardTransactionEditModal';
import CardTransactionDeleteModal from './CardTransactionDeleteModal';

import CardRequest from '../../../axios/CardRequest';
import CardTransRequest from '../../../axios/CardTransRequest';
import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    cardId: "",
    cardInstId: "",
    limit: 10
}

function CardTransactionList(props) {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [cardsTransactions, setCardsTransactions] = useState([]);
    const [cardsInstallments, setCardsInstallments] = useState([]);
    const [modalShow, setModalShow] = useState({name:"", id: 0});
    const [appearMoreButton, setAppearMoreButton] = useState(true);

    const loadCards = () => 
        CardRequest.getCards()
        .then(cards => setCards(cards));

    const loadCardsTransactions = (append, cardId, cardInstId) => 
        CardTransRequest.getCardsTransactions(
            cardId||formData.cardId, 
            cardInstId||formData.cardInstId,
            undefined, 
            undefined, 
            append?cardsTransactions.length:0, 
            formData.limit)
        .then(cardsTrans => {
            setCardsTransactions(
                append? [...cardsTransactions, ...cardsTrans] : cardsTrans
            );
            setAppearMoreButton((cardsTrans.length >= formData.limit));
        });

    const loadCardsInstallments = (cardId) => 
        CardInstRequest.getCardsInstallments(cardId)
        .then(cardsInsts => setCardsInstallments(cardsInsts));

    useEffect(()=>{
        loadCards();
        if(props.location.state) {
            const {cardId, cardInstId} =  props.location.state;
            setFormData({...formData, cardId, cardInstId});
            if(cardId) loadCardsInstallments(cardId);
            loadCardsTransactions(false, cardId, cardInstId);
        } else {
            loadCardsTransactions(false);
        }
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleCardChange = (event) => {
        handleChange(event);
        if(event.target.value) loadCardsInstallments(event.target.value);
        else setCardsInstallments([]);
    }

    const handleListClick = () => {
        loadCardsTransactions(false);
    }

    const handleResetClick = () => {
        setFormData({...initialState});
        setCardsInstallments([]);
    }

    const handleEditCardTrans = (id) => {
        setModalShow({name:"Edit",id})
    }

    const handleDeleteCardTrans = (id) => {
        setModalShow({name:"Delete",id})
    }

    const handleMoreClick = () => {
        loadCardsTransactions(true);
    }

    return (
        <React.Fragment>
            <FormContainer title="Cards Transactions" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalShow({name:"Add",id:0})}>
                    Add New Card Transaction</Button>
                }>
                <Form>
                    <Row>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardId" onChange={handleCardChange}
                        value={formData.cardId}>
                        <option value=''>Cards</option>
                        <CardsDropDown cards={cards}/>
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardInstId" onChange={handleChange}
                        value={formData.cardInstId}>
                        <option value=''>Card Installments</option>
                        <CardsInstallmentsDropDown cardsInstallments={cardsInstallments} />
                        </Form.Control>
                    </Col>
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" name="limit" onChange={handleChange}
                            value={formData.limit}>
                            <TableLimiterDropDown />
                        </Form.Control>
                    </Col>
                    <Col xs={1}>
                        <Button variant="primary" size="sm" block onClick={handleListClick}>
                            List</Button>
                    </Col>
                    <Col xs={1}>
                        <Button variant="secondary" size="sm" block onClick={handleResetClick}>
                            Reset</Button>
                    </Col>
                    </Row>
                </Form>
            </FormContainer>
            <FormContainer>
                <CardTransactionTable cardsTransactions={cardsTransactions}
                onEditCardTrans={handleEditCardTrans}
                onDeleteCardTrans={handleDeleteCardTrans}/>
                <Button variant="primary" size="sm" block onClick={handleMoreClick}
                    hidden={!appearMoreButton}>
                    more...</Button>
            </FormContainer>
            <CardTransactionAddModal 
                cards={cards}
                show={modalShow.name==='Add'} 
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsTransactions(false)}
            />
            <CardTransactionEditModal
                cards={cards}
                cardTransId={modalShow.id}
                show={modalShow.name==='Edit'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsTransactions(false)}
            />
            <CardTransactionDeleteModal
                cards={cards}
                cardTransId={modalShow.id}
                show={modalShow.name==='Delete'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onDelete={()=>loadCardsTransactions(false)}
            />
        </React.Fragment>
    )
}

export default CardTransactionList;