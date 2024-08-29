import React, { Component } from 'react';
import { Card, Row, Col, Button, Collapse } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

//import amountFormatter from '../../utilities/amountFormatter';

class MonthlyDetails extends Component {
  state = {
    open: false,
  }
  render() {
    return (
      <Card border="primary" style={{ width: '26rem' }}>
        <Card.Header>
          <Button variant="link" onClick={() => this.setState({ open: !this.state.open })}>
            {moment(this.props.data.fromDate).format('DD-MMM-YYYY')} To {moment(this.props.data.toDate).format('DD-MMM-YYYY')}
          </Button>
        </Card.Header>
        <Collapse in={this.state.open}>
        <Card.Body>
          {
            this.props.data.monthlyStatistics && this.props.data.monthlyStatistics.map( (ms, index, arr) => {
              return (
                <React.Fragment key={'ms'+index}>
                  <Row>
                    <Col><strong>{ms.detailName}</strong></Col>
                    <Col className="text-right"><strong>
                    {
                      // amountFormatter(Math.abs(getTotalItems(ms.details)), this.props.decimalPlace)
                      ms.totalItemFormatted
                    }
                    </strong></Col>
                  </Row>
                    {
                      ms.details && ms.details.map( (detail, index) => {
                        return (
                          <Row key={'dt'+index}>
                            <Col xs={8}>
                              { detail.typeName ? 
                                <Button variant="link" size="sm" 
                                onClick={() => this.onTransactionTypeClick(detail.typeId, 
                                this.props.data.fromDate, this.props.data.toDate, detail.typeName)}>
                                  {detail.typeName}
                                </Button>
                                 : <Button variant="link" size="sm">No Transaction Type</Button>
                              }
                            </Col>
                            <Col className="text-right">
                              {/* {amountFormatter(Math.abs(detail.total), this.props.decimalPlace)} */}
                              {detail.totalFormatted}
                            </Col>
                          </Row>
                        )
                      })
                    }
                    {
                      index !== (arr.length-1) && <hr />
                    }
                </React.Fragment>
              )
            })
          }
        </Card.Body>
        </Collapse>
        <Card.Footer className="text-muted">
          <Row>
            <Col>
              <strong>Total</strong>
            </Col>
            <Col><strong>
              {/* {amountFormatter(getTotalMonthlyStatistics(this.props.data.monthlyStatistics), this.props.decimalPlace)} */}
              {this.props.data.finalTotalFormatted}
            </strong></Col>
          </Row>
        </Card.Footer>
      </Card>
    )
  }

  onTransactionTypeClick = (typeId, fromDate, toDate, typeName) => {
    if (typeof this.props.onTransactionTypeClick === 'function') {
      this.props.onTransactionTypeClick(typeId, fromDate, toDate, typeName);
    }
  }
}

function getTotalItems (details) {
  if(!details) {
    return 0;
  }
  return details.reduce( (prv, detail) => {
    return prv + parseFloat(detail.total);
  }, 0)
}

function getTotalMonthlyStatistics (monthlyStatistics) {
  if(!monthlyStatistics) {
    return 0;
  }

  const details = monthlyStatistics.map( (ms) => {
    return getTotalItems(ms.details);
  });
  return details.reduce( (prv, total) => {
    return Math.round((prv + total)*100) / 100;
  }, 0)
}

MonthlyDetails.propTypes = {
  decimalPlace: PropTypes.number,
};

MonthlyDetails.defaultProps = {
  decimalPlace: 2,
}

export default MonthlyDetails;
