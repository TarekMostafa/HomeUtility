import React, {useState, useEffect} from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import 'moment/locale/en-gb.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import FormContainer from '../../common/FormContainer';
import TableLimiterDropDown from '../../common/TableLimiterDropDown';
import YesNoDropDown from '../../common/YesNoDropDown';
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
    limit: 10,
    description: '',
    includeDescription: true,
    transDateFrom: '',
    transDateTo: '',
    payForOthers: '',
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
            formData.limit,
            formData.description,
            formData.includeDescription,
            formData.transDateFrom,
            formData.transDateTo,
            formData.payForOthers)
        .then(cardsTrans => {
            setCardsTransactions(
                append? [...cardsTransactions, ...cardsTrans] : cardsTrans
            );
            setAppearMoreButton((cardsTrans.length >= formData.limit));
        });

    const loadCardsInstallments = () => 
        CardInstRequest.getCardsInstallments()
        .then(cardsInsts => setCardsInstallments(cardsInsts));

    useEffect(()=>{
        loadCards();
        loadCardsInstallments();
        if(props.location.state) {
            const {cardId, cardInstId} =  props.location.state;
            setFormData({...formData, cardId, cardInstId});
            loadCardsTransactions(false, cardId, cardInstId);
        } else {
            loadCardsTransactions(false);
        }
    },[])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : (event.target.type==='checkbox' ? event.target.checked : event.target.value)
          })
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

    const handleTransDateFromChange = (jsDate, date) => {
        setFormData({
            ...formData,
            transDateFrom: date
        });
    }
    
    const handleTransDateToChange = (jsDate, date) => {
        setFormData({
            ...formData,
            transDateTo: date
        });
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
                        <Form.Control as="select" size="sm" name="cardId" onChange={handleChange}
                        value={formData.cardId}>
                        <option value=''>Cards</option>
                        <CardsDropDown cards={cards}/>
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control as="select" size="sm" name="cardInstId" onChange={handleChange}
                        value={formData.cardInstId}>
                        <option value=''>Card Installments</option>
                        <CardsInstallmentsDropDown 
                            cardsInstallments={cardsInstallments} 
                            cardId={formData.cardId}/>
                        </Form.Control>
                    </Col>
                    <Col>
                        <DatePickerInput value={formData.transDateFrom}
                        onChange={handleTransDateFromChange} readOnly 
                        placeholder="Transaction Date From" small/>
                    </Col>
                    <Col>
                        <DatePickerInput value={formData.transDateTo}
                        onChange={handleTransDateToChange} readOnly 
                        placeholder="Transaction Date To" small/>
                    </Col>
                    </Row>
                    <br />
                    <Row>
                    <Col xs={6}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Checkbox name="includeDescription"
                                checked={formData.includeDescription} onChange={handleChange}/>
                            </InputGroup.Prepend>
                            <Form.Control type="input" placeholder="description" size="sm" name="description"
                                onChange={handleChange} value={formData.description}/>
                        </InputGroup>
                    </Col> 
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" name="payForOthers" onChange={handleChange}
                            value={formData.payForOthers}>
                            <option value=''>Pay For Others</option>
                            <YesNoDropDown yesText="Pay For Others (Yes)" noText="Pay For Others (No)"/>
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
                cardsInstallments={cardsInstallments}
                show={modalShow.name==='Add'} 
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsTransactions(false)}
            />
            <CardTransactionEditModal
                cards={cards}
                cardsInstallments={cardsInstallments}
                cardTransId={modalShow.id}
                show={modalShow.name==='Edit'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onSave={()=>loadCardsTransactions(false)}
            />
            <CardTransactionDeleteModal
                cards={cards}
                cardsInstallments={cardsInstallments}
                cardTransId={modalShow.id}
                show={modalShow.name==='Delete'}
                onHide={()=>setModalShow({name:"", id: 0})}
                onDelete={()=>loadCardsTransactions(false)}
            />
        </React.Fragment>
    )
}

export default CardTransactionList;