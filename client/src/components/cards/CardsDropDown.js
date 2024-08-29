import React from 'react';

// import cardNumberFormatter from '../../utilities/cardNumberFormatter';

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
                    decimalplaces={card.currencyDecimalPlace}>
                    {/* {`${cardNumberFormatter(card.cardNumber)} - ${card.bankName} - ${card.cardCurrency}`} */}
                    {`${card.cardNumberFormatted} - ${card.bankName} - ${card.cardCurrency}`} 
                </option>
            ))
        }
        </React.Fragment>
    )
}

export default CardsDropDown;