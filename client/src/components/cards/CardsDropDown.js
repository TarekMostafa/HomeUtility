import React from 'react';

function CardsDropDown(props){
    return (
        <React.Fragment>
        {
            props.cards && props.cards.map(card=> (
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