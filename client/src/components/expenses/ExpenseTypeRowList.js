import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';

function ExpenseTypeRowList(props) {
    const { expenseTypes } = props;
    return (
        <div>
            {
                expenseTypes && expenseTypes.map( expenseType => {
                    return (<Button key={expenseType.expenseTypeId} variant="outline-info" size="lg">
                        {expenseType.expenseTypeName}  <Badge pill variant="success">123</Badge>
                    </Button>);
                })
            }
        </div>
    );
}

const mapStateToProps = (state) => {
	return {
        expenseTypes: state.lookups.expenseTypes
	}
}

export default connect(mapStateToProps)(ExpenseTypeRowList)