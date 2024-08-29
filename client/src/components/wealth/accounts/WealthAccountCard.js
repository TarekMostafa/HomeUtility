import React from 'react';
import { Card, Table, ButtonGroup, Button, Badge } from 'react-bootstrap';
import moment from 'moment';
// import { connect } from 'react-redux';

// import amountFormatter from '../../../utilities/amountFormatter';

function WealthAccountCard(props) {
    let {account} = props;
    return (
        account && 
        <Card key={account.accountId} text='dark' className="mb-2" border="secondary">
            <Card.Header>
                <Table size="sm" responsive="sm" borderless>
                    <tbody>
                        <tr>
                            <td>{account.accountNumber}</td>
                            <td className="text-right">
                                <strong>
                                    {/* {amountFormatter(account.accountCurrentBalance, 
                                    account.currencyDecimalPlace)} {account.accountCurrency} */}
                                    {account.accountCurrentBalanceFormatted} {account.accountCurrency}
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <Table size="sm" responsive="sm" borderless>
                        <tbody>
                            <tr>
                                <td>{account.bankName}</td>
                                <td className="text-right"><Badge variant={account.accountStatus==="CLOSED"?"warning":"success"}>{account.accountStatus}</Badge></td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Title>
                <Table size="sm" responsive="sm">
                    <tbody>
                        <tr>
                            <td>Start Balance:</td>
                            <td className="text-right">
                                {/* {amountFormatter(account.accountStartBalance, 
                                    account.currencyDecimalPlace)} {account.accountCurrency} */}
                                {account.accountStartBalanceFormatted} {account.accountCurrency}
                            </td>
                        </tr>
                        <tr>
                            <td>Equivalent Balance:</td>
                            <td className="text-right">
                                {/* {amountFormatter(account.accountCurrentBalance * 
                                account.currencyRateAgainstBase,
                                props.appSettings.currency.currencyDecimalPlace)} 
                                {props.appSettings.baseCurrency} */}
                                {account.accountEquivalentBalanceFormatted} {props.baseCurrency}
                            </td>
                        </tr>
                        <tr>
                            <td>Balance Last Update:</td>
                            <td className="text-right">
                                {
                                account.accountLastBalanceUpdate ?
                                moment(account.accountLastBalanceUpdate).format('DD/MMM/YYYY HH:mm:ss') : ''
                                }
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
            <Card.Footer>
                <ButtonGroup>
                    <Button variant="link" size="sm"
                    onClick={() => props.onEditAccount(account.accountId)}>Edit</Button>
                    <Button variant="link" size="sm"
                    onClick={() => props.onDeleteAccount(account.accountId)}>Delete</Button>
                </ButtonGroup>
            </Card.Footer>
        </Card>
    );
}

// const mapStateToProps = (state) => {
// 	return {
//     appSettings: state.lookups.appSettings,
// 	}
// }

// export default connect(mapStateToProps)(WealthAccountCard);
export default WealthAccountCard;