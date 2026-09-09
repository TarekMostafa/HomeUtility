import React from 'react';
import { Dropdown } from 'react-bootstrap'; 
import PropTypes from 'prop-types';

function MultiSelectDropDown (props){
    let text = props.labelSelect;
    if(props.selectedValues && props.selectedValues.length > 0) 
        text=text+ ' ('+props.selectedValues.length+')';
    return (
        <React.Fragment>
        <Dropdown>
            <Dropdown.Toggle variant="outline-secondary"
            className="w-100 text-start d-flex align-items-center justify-content-between">
                {text}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-2" style={{maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden', minWidth: '100%' }}>
                {props.children}
            </Dropdown.Menu>
        </Dropdown>
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

export const SetMultiSelectItem = (list, key, value) => {
    let _list = list;
    if(_list.some(item=>item.key === key)) 
        _list = _list.filter(item=>item.key!==key);
    else
        _list = [..._list, {key, value}];
    return _list;
}