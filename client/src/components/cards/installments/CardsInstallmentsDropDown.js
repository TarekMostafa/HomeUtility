import React from 'react';

function CardsInstallmentsDropDown(props){
    return (
        <React.Fragment>
        {
            props.cardsInstallments && props.cardsInstallments.map(inst => (
                <option key={inst.cInstId} value={inst.cInstId}>
                    {inst.cInstItemDesc}
                </option>
            ))
        }
        </React.Fragment>
    )
}

export default CardsInstallmentsDropDown;