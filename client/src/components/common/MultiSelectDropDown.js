import React from 'react';
import { Form } from 'react-bootstrap'; 
import PropTypes from 'prop-types';

function MultiSelectDropDown (props){
    let text = props.labelSelect;
    if(props.selectedValues && props.selectedValues.length > 0) 
        text=text+ ' ('+props.selectedValues.length+')';
    return (
        <React.Fragment>
        <Form.Control as="select" size="sm" value='' onChange={()=>{''}}>
            <option value=''>{text}</option>
            {props.children}
        </Form.Control>
        {props.selectedValues.join(', ')}
        </React.Fragment>
    )
}

MultiSelectDropDown.propTypes = {
    labelSelect: PropTypes.string,
    selectedValues: PropTypes.array,
}
  
MultiSelectDropDown.defaultProps = {
    labelSelect: "Select Options",
    selectedValues: [],
}
  
export default MultiSelectDropDown;