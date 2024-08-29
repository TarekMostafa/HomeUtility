import React from 'react';
import { Container, CardColumns } from 'react-bootstrap';
import WealthAccountCard from './WealthAccountCard';

function WealthAccountsContainer(props){
    return (
        <Container fluid>
            <CardColumns>
            {
                props.accounts && props.accounts.map( (account, index) => {
                    return (
                        // <Col key={index} md="4" lg="3"><WealthAccountCard account={account} onEditAccount={props.onEditAccount}
                        //     onDeleteAccount={props.onDeleteAccount}/></Col> 
                        <WealthAccountCard key={account.accountId} account={account} onEditAccount={props.onEditAccount}
                             onDeleteAccount={props.onDeleteAccount} {...props}/>
                    );
                })
            }
            </CardColumns>
        </Container>
    );
}

export default WealthAccountsContainer;