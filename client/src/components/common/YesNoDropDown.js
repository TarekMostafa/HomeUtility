import React from 'react';

function YesNoDropDown(props) {
    return (
        <React.Fragment>
            <option key='Yes' value='Y'>{props.yesText? props.yesText: 'Yes'}</option>
            <option key='No' value='N'>{props.noText? props.noText: 'No'}</option>
        </React.Fragment>
    )
}

export default YesNoDropDown;