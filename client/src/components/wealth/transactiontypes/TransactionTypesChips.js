import React from 'react';
import Chips, {Chip} from 'react-chips';
import { connect } from 'react-redux';

function TransactionTypesChips(props) {

    return (
        <Chips value={props.value} onChange={props.onChange}
            name={props.name}
            getChipValue={e=>e.typeName}
            suggestions={props.transactionTypes.filter(e=>props.onFilter(e))}
            suggestionsFilter={()=> true}
            fromSuggestionsOnly alwaysRenderSuggestions
            getSuggestionValue={e=>e.typeName}
            renderChip={e=>(<Chip>{e.typeName}</Chip>)}
            renderSuggestion={e=>(<div>{e.typeName}</div>)}
        />
    )
}

const mapStateToProps = (state) => {
	return {
    transactionTypes: state.lookups.transactionTypes
	}
}

export default connect(mapStateToProps)(TransactionTypesChips);