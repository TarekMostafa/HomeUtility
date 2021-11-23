import React from 'react';

function CardsInstallmentsDropDown(props){
    let { cardsInstallments } = props;
    if(!cardsInstallments) return null;
    if(props.cardId!==undefined) 
        cardsInstallments = cardsInstallments.filter(item=>(item.cardId+'')===(props.cardId+''));
    return (
        <React.Fragment>
        {
            cardsInstallments.map(inst => (
                <option key={inst.cInstId} value={inst.cInstId}>
                    {inst.cInstItemDesc}
                </option>
            ))
        }
        </React.Fragment>
    )
}

export default CardsInstallmentsDropDown;