import React from 'react';
import { connect } from 'react-redux';

function RelatedTypesDropDown(props) {
  let {relatedTypes} = props;
  if(!relatedTypes) {
    return null;
  }
  return relatedTypes.map( (relatedType) => {
    return (
      <option key={relatedType.typeCode} value={relatedType.typeCode}>
      {relatedType.typeDescription}
      </option>
    )
  });
}

const mapStateToProps = (state) => {
	return {
    relatedTypes: state.lookups.relatedTypes
	}
}

export default connect(mapStateToProps)(RelatedTypesDropDown)
