import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import CardInstallmentTable from './CardInstallmentTable';
import CardsDropDown from '../CardsDropDown';
import CardInstallmentAddModal from './CardInstallmentAddModal';
import CardInstallmentEditModal from './CardInstallmentEditModal';
import CardInstallmentDeleteModal from './CardInstallmentDeleteModal';
import CardInstallmentPostModal from './CardInstallmentPostModal';
import CardInstallmentTerminateModal from './CardInstallmentTerminateModal';

import CardRequest from '../../../axios/CardRequest';
import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    cardId: ""
}

function CardInstallmentList(props) {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [cardsInstallments, setCardsInstallments] = useState([]);
    const [modalShow, setModalShow] = useState({name:"", id: 0});

    const loadCards = () => 
        CardRequest.getCards()
        .then(cards => setCards(cards));

    const loadCardsInstallments = () => 
        CardInstRequest.getCardsInstallments(formData.cardId)
        .then(cardsInsts => setCardsInstallments(cardsInsts));

    useEffect(()=>{
        loadCards();
        loadCardsInstallments();
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleListClick = () => {
        loadCardsInstallments();
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleEditCardInst = (id) => {
        setModalShow({name:"Edit",id})
    }

    const handleDeleteCardInst = (id) => {
        setModalShow({name:"Delete",id})
    }

    const handlePostCardInst = (id) => {
        setModalShow({name:"Post",id})
    }

    const handleViewCardTransactions = (cardId, cardInstId) => {
        props.history.push('cardsTranactions', {cardId, cardInstId});
    }

    const handleTerminateCardInst = (id) => {
        setModalShow({name:"Terminate",id})
    }

    return (
        <React.Fragment>
            <FormContainer title="Cards Installments" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalShow({name:"Add",id:0})}>
                    Add New Card Installment</Button>
                }>
                <Form>
                    <Row>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardId" onChange={handleChange}
                        value={formData.cardId}>
                        <option value=''>Cards</option>
                        <CardsDropDown cards={cards}/>
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
                <CardInstallmentTable cardsInstallments={cardsInstallments}
                onEditCardInst={handleEditCardInst}
                onDeleteCardInst={handleDeleteCardInst}
                onPostCardInst={handlePostCardInst}
                onViewCardTransactions={handleViewCardTransactions}
                onTerminateCardInst={handleTerminateCardInst}/>
            </FormContainer>
            <CardInstallmentAddModal 
                cards={cards}
                show={modalShow.name==='Add'} 
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentEditModal
                cards={cards}
                cardInstId={modalShow.id}
                show={modalShow.name==='Edit'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentDeleteModal
                cards={cards}
                cardInstId={modalShow.id}
                show={modalShow.name==='Delete'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onDelete={()=>loadCardsInstallments()}
            />
            <CardInstallmentPostModal
                cards={cards}
                cardInstId={modalShow.id}
                show={modalShow.name==='Post'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onPost={()=>loadCardsInstallments()}
            />
            <CardInstallmentTerminateModal
                cards={cards}
                cardInstId={modalShow.id}
                show={modalShow.name==='Terminate'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onTerminate={()=>loadCardsInstallments()}
            />
        </React.Fragment>
    )
}

export default CardInstallmentList;