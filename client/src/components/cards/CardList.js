import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import FormContainer from '../common/FormContainer';
import BanksDropDown from '../wealth/banks/BanksDropDown';
import CurrenciesDropDown from '../currencies/CurrenciesDropDown';
import AccountStatusesDropDown from '../wealth/accounts/AccountStatusesDropDown';
import CardTable from './CardTable';
import CardAddModal from './CardAddModal';
import CardEditModal from './CardEditModal';
import CardDeleteModal from './CardDeleteModal';

import CardRequest from '../../axios/CardRequest';

const initialState = {
    cardBank: "",
    cardCurrency: "",
    cardStatus: "ACTIVE"
}

function CardList() {

    const [formData, setFormData] = useState(initialState);
    const [cards, setCards] = useState([]);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [modalEdit, setModalEdit] = useState({show: false, id: 0});
    const [modalDelete, setModalDelete] = useState({show: false, id: 0});

    const loadCards = () => 
        CardRequest.getCards(formData.cardBank, formData.cardCurrency, formData.cardStatus)
        .then(cards => setCards(cards));

    useEffect(()=>{
        loadCards();
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
          })
    }

    const handleListClick = () => {
        loadCards();
    }

    const handleResetClick = () => {
        setFormData({...initialState});
    }

    const handleEditCard = (id) => {
        setModalEdit({show: true, id});
    }

    const handleDeleteCard = (id) => {
        setModalDelete({show: true, id});
    }

    return (
        <React.Fragment>
            <FormContainer title="Cards Summary" toolbar={
                <Button variant="info" size="sm" onClick={()=>setModalAddShow(true)}>
                    Add New Card</Button>
                }>
                <Form>
                    <Row>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardBank" onChange={handleChange}
                        value={formData.cardBank}>
                        <option value=''>Banks</option>
                        <BanksDropDown />
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardCurrency" onChange={handleChange}
                        value={formData.cardCurrency}>
                        <option value=''>Currencies</option>
                        <CurrenciesDropDown />
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardStatus" onChange={handleChange}
                        value={formData.cardStatus}>
                        <option value=''>Card Statuses</option>
                        <AccountStatusesDropDown />
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
                <CardTable cards={cards} onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}/>
            </FormContainer>
            <CardAddModal 
                show={modalAddShow} 
                onHide={()=>setModalAddShow(false)}
                onSave={()=>loadCards()}
            />
            <CardEditModal
                cardId={modalEdit.id}
                show={modalEdit.show}
                onHide={()=>setModalEdit({show: false, id: 0})}
                onSave={()=>loadCards()}
            />
            <CardDeleteModal
                cardId={modalDelete.id}
                show={modalDelete.show}
                onHide={()=>setModalDelete({show: false, id: 0})}
                onDelete={()=>loadCards()}
            />
        </React.Fragment>
    );
}

export default CardList;