import React from 'react';
import { Card, Table, ButtonGroup, Button, Badge, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';

import amountFormatter from '../../../utilities/amountFormatter';

function WealthAccountCard(props) {
    let {account} = props;
    return (
        account && 
        <Card bg='light' key={account.accountId} text='dark' style={{ width: '24rem' }} className="mb-2">
            <Card.Header>
                <div>
                    <Row>
                        <Col>{account.accountNumber}</Col>
                        <Col md={{offset: 1, span: 5}}><strong>{amountFormatter(account.accountCurrentBalance, account.currency.currencyDecimalPlace)} {account.accountCurrency}</strong></Col>
                    </Row>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <div>
                        <Row>
                            <Col>{account.bank.bankName}</Col>
                            <Col md="3"><Badge variant={account.accountStatus==="CLOSED"?"warning":"success"}>{account.accountStatus}</Badge></Col>
                        </Row>
                    </div>
                </Card.Title>
                <Table size="sm" responsive="sm">
                    <tbody>
                        <tr>
                            <td>Start Balance:</td>
                            <td className="text-right">{amountFormatter(account.accountStartBalance, account.currency.currencyDecimalPlace)} {account.accountCurrency}</td>
                        </tr>
                        <tr>
                            <td>Equivalent Balance:</td>
                            <td className="text-right">{amountFormatter(account.accountCurrentBalance * account.currency.currencyRateAgainstBase,
                                                props.appSettings.currency.currencyDecimalPlace)} {props.appSettings.baseCurrency}</td>
                        </tr>
                        <tr>
                            <td>Balance Last Update:</td>
                            <td>
                                {
                                account.accountLastBalanceUpdate ?
                                moment(account.accountLastBalanceUpdate).format('DD/MMM/YYYY HH:mm:ss') : ''
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
            <ButtonGroup>
                <Button variant="link" size="sm"
                onClick={() => props.onEditAccount(account.accountId)}>Edit</Button>
                <Button variant="link" size="sm"
                onClick={() => props.onDeleteAccount(account.accountId)}>Delete</Button>
            </ButtonGroup>
        </Card>
    );
}

const mapStateToProps = (state) => {
	return {
    appSettings: state.lookups.appSettings,
	}
}

export default connect(mapStateToProps)(WealthAccountCard);