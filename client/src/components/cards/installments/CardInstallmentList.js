import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import FormContainer from '../../common/FormContainer';
import CardInstallmentTable from './CardInstallmentTable';
import CardsDropDown from '../CardsDropDown';
import CardInstallmentAddModal from './CardInstallmentAddModal';
import CardInstallmentEditModal from './CardInstallmentEditModal';
import CardInstallmentDeleteModal from './CardInstallmentDeleteModal';

import CardRequest from '../../../axios/CardRequest';
import CardInstRequest from '../../../axios/CardInstRequest';

const initialState = {
    cardId: ""
}

function CardInstallmentList() {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [cardsInstallments, setCardsInstallments] = useState([]);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});

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
        setModalEdit({show: true, id});
    }

    const handleDeleteCardInst = (id) => {
        setModalDelete({show: true, id});
    }

    return (
        <React.Fragment>
            <FormContainer title="Cards Installments" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
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
                <CardInstallmentTable cards={cards} cardsInstallments={cardsInstallments}
                onEditCardInst={handleEditCardInst}
                onDeleteCardInst={handleDeleteCardInst}/>
            </FormContainer>
            <CardInstallmentAddModal 
                cards={cards}
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentEditModal
                cardInstId={modalEdit.id}
                show={modalEdit.show}
                onHide={()=>setModalEdit({show: false, id: 0})}
                onSave={()=>loadCardsInstallments()}
            />
            <CardInstallmentDeleteModal
                cardInstId={modalDelete.id}
                show={modalDelete.show}
                onHide={()=>setModalDelete({show: false, id: 0})}
                onDelete={()=>loadCardsInstallments()}
            />
        </React.Fragment>
    )
}

export default CardInstallmentList;