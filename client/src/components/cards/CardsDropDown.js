import React from 'react';

function CardsDropDown(props){
    let { cards } = props;
    if(cards) {
        cards = cards.filter( card => {
            return !props.status || card.cardStatus === props.status;
        })
    }
    return (
        <React.Fragment>
        {
            cards && cards.map(card=> (
                <option key={card.cardId} value={card.cardId} 
                    currencycode={card.cardCurrency}
                    decimalplaces={card.currency.currencyDecimalPlace}>
                    {`${card.cardNumber} - ${card.bank.bankName}`}
                </option>
            ))
        }
        </React.Fragment>
    )
}

export default CardsDropDown;