import React from 'react';
import { Table, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';

// import amountFormatter from '../../../utilities/amountFormatter';
import cardNumberFormatter from '../../../utilities/cardNumberFormatter';

function CardTransactionTable (props) {
  return (
    <Table hover bordered size="sm" responsive="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Card</th>
          <th>Trans Amount</th>
          <th>Trans Currency</th>
          <th>Trans Date</th>
          <th>Trans Desc</th>
          <th>Pay For Others?</th>
          <th>Bill Amount</th>
          <th>Bill Date</th>
          <th>Is Instal.?</th>
          <th>Is Paid?</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.cardsTransactions && props.cardsTransactions.map( (trans, index) => {
          const cardInfo = `${cardNumberFormatter(trans.cardNumber)} 
                          - ${trans.bankName} - ${trans.cardCurrency}`;
          return (
            <tr key={trans.cardTransId}>
              <td>{index+1}</td>
              <td>
                <OverlayTrigger placement="right"
                  delay={{ show: 250, hide: 400 }} overlay={(
                    <Tooltip>{cardInfo}</Tooltip>
                  )}>
                  <span className="textEllipsis">
                    {cardInfo}
                  </span>
                </OverlayTrigger>
              </td>
              <td className="text-right">
                {/* {amountFormatter(trans.cardTransAmount, trans.currencyDecimalPlace)} */}
                {trans.cardTransAmountFormatted}
              </td>
              <td>{trans.cardTransCurrency}</td>
              <td>
                {moment(trans.cardTransDate).format('DD/MM/YYYY')}
              </td>
              <td>
                <OverlayTrigger placement="right"
                  delay={{ show: 250, hide: 400 }} overlay={(
                    <Tooltip>{trans.cardTransDesc}</Tooltip>
                  )}>
                  <span className="textEllipsis">
                    {trans.cardTransDesc}
                  </span>
                </OverlayTrigger>
              </td>
              <td>{trans.cardTransPayForOthers?'YES':'NO'}</td>
              <td className="text-right">
                {/* {amountFormatter(trans.cardTransBillAmount, trans.cardCurrencyDecimalPlace)} */}
                {trans.cardTransBillAmountFormatted}
              </td>
              <td>
                {
                    trans.cardTransBillDate ?
                    moment(trans.cardTransBillDate).format('DD/MM/YYYY'):""
                }
              </td>
              <td>{trans.cardTransIsInstallment?'YES':'NO'}</td>
              <td>{trans.cardTransIsPaid?'YES':'NO'}</td>
              <td>{trans.cardTransId}</td>
              <td>
              <DropdownButton id="dropdown-basic-button" title="Actions"
                size="sm" variant="primary">
              {
                !trans.cardTransIsInstallment &&
                <Dropdown.Item onClick={() => props.onEditCardTrans(trans.cardTransId)}>
                  Edit
                </Dropdown.Item>
              }
                <Dropdown.Item onClick={() => props.onDeleteCardTrans(trans.cardTransId)}>
                  Delete
                </Dropdown.Item>
              </DropdownButton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default CardTransactionTable;
