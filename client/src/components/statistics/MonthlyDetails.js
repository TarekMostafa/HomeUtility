import React, { Component } from 'react';
import { Card, Row, Col, Button, Collapse } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

import amountFormatter from '../../utilities/amountFormatter';

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
                    <Col>
                    {
                      amountFormatter(Math.abs(getTotalItems(ms.details)), this.props.decimalPlace)
                    }
                    </Col>
                  </Row>
                    {
                      ms.details && ms.details.map( (detail, index) => {
                        return (
                          <Row key={'dt'+index}>
                            <Col>
                              {detail.transactionType.typeName}
                            </Col>
                            <Col>
                              {amountFormatter(Math.abs(detail.total), this.props.decimalPlace)}
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
            <Col>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    )
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
  console.log(details);
}

MonthlyDetails.propTypes = {
  decimalPlace: PropTypes.number,
};

MonthlyDetails.defaultProps = {
  decimalPlace: 2,
}

export default MonthlyDetails;
