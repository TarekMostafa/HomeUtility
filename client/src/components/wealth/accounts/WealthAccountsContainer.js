import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import WealthAccountCard from './WealthAccountCard';

function WealthAccountsContainer(props){
    return (
        <Container fluid>
            <Row>
            {
                props.accounts && props.accounts.map( (account, index) => {
                    return (
                        <Col key={index} md="3"><WealthAccountCard account={account} onEditAccount={props.onEditAccount}
                            onDeleteAccount={props.onDeleteAccount}/></Col> 
                    );
                })
            }
            </Row>
        </Container>
    );
}

export default WealthAccountsContainer;