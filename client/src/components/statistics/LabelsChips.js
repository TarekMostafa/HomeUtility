import React from 'react';
import Chips, {Chip} from 'react-chips';

function LabelsChips(props) {

    return (
        <Chips value={props.value} onChange={props.onChange}
            name={props.name}
            renderChip={e=>(<Chip>{e}</Chip>)}
        />
    )
}

export default LabelsChips;