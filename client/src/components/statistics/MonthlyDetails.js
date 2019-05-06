import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

function MonthlyDetails (props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Header>
        {new Date(props.data.toDate).toLocaleString('en-us', { month: 'long' })}
        { new Date(props.data.toDate).getFullYear()}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <ListGroup>
          {
            props.data.monthlyStatistics && props.data.monthlyStatistics.map( (details, index) => {
              return (
                <ListGroup.Item key={index}>
                  {details.detailName}
                  <ListGroup>
                    {
                      details.details && details.details.map( (detail, index) => {
                        return (
                          <ListGroup.Item key={index}>
                            {detail.transactionType.typeName}
                            <Badge variant="secondary">{detail.total}</Badge>
                          </ListGroup.Item>
                        )
                      })
                    }
                  </ListGroup>
                </ListGroup.Item>
              )
            })
          }
          </ListGroup>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default MonthlyDetails;
