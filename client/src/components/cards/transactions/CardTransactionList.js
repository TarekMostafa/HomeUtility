import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import CardTransactionTable from './CardTransactionTable';
import CardsDropDown from '../CardsDropDown';
import CardsInstallmentsDropDown from '../installments/CardsInstallmentsDropDown';

import CardRequest from '../../../axios/CardRequest';
import CardTransRequest from '../../../axios/CardTransRequest';
import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    cardId: "",
    cardInstId: ""
}

function CardTransactionList(props) {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [cardsTransactions, setCardsTransactions] = useState([]);
    const [cardsInstallments, setCardsInstallments] = useState([]);
    const [modalShow, setModalShow] = useState({name:"", id: 0});

    const loadCards = () => 
        CardRequest.getCards()
        .then(cards => setCards(cards));

    const loadCardsTransactions = (cardId, cardInstId) => 
        CardTransRequest.getCardsTransactions(cardId||formData.cardId, cardInstId||formData.cardInstId)
        .then(cardsTrans => setCardsTransactions(cardsTrans));

    const loadCardsInstallments = (cardId) => 
        CardInstRequest.getCardsInstallments(cardId)
        .then(cardsInsts => setCardsInstallments(cardsInsts));

    useEffect(()=>{
        loadCards();
        if(props.location.state) {
            const {cardId, cardInstId} =  props.location.state;
            setFormData({...formData, cardId, cardInstId});
            if(cardId) loadCardsInstallments(cardId);
            loadCardsTransactions(cardId, cardInstId);
        } else {
            loadCardsTransactions();
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
        loadCardsInstallments(event.target.value);
    }

    const handleListClick = () => {
        loadCardsTransactions();
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleEditCardInst = (id) => {
        //setModalEdit({show: true, id});
    }

    const handleDeleteCardInst = (id) => {
        //setModalDelete({show: true, id});
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
                onEditCardInst={handleEditCardInst}
                onDeleteCardInst={handleDeleteCardInst}/>
            </FormContainer>
            {/* <CardInstallmentAddModal 
                cards={cards}
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentEditModal
                cards={cards}
                cardInstId={modalEdit.id}
                show={modalEdit.show}
                onHide={()=>setModalEdit({show: false, id: 0})}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentDeleteModal
                cards={cards}
                cardInstId={modalDelete.id}
                show={modalDelete.show}
                onHide={()=>setModalDelete({show: false, id: 0})}
                onDelete={()=>loadCardsInstallments()}
            /> */}
        </React.Fragment>
    )
}

export default CardTransactionList;