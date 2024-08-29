import React from 'react';
import { Badge, Alert, ListGroup } from 'react-bootstrap';

import NoData from '../common/NoData';

function HomeDetails(props) {

    let noData = true;
    if(props.data && props.data.aggregate 
      && Array.isArray(props.data.aggregate) && props.data.aggregate.length > 0)
      noData = false;

    return(
        <React.Fragment>
        {
        <ListGroup>
          {
            !noData && props.data.aggregate.map(
              aggregate => {
                return (
                  <ListGroup.Item key={aggregate.currency}>
                    <Alert className="text-center">
                    <Badge variant="light">
                      {aggregate.totalCount} 
                    </Badge>
                    <Badge pill variant="primary">
                      <h5>{aggregate.formattedTotalBalance} {aggregate.currency}</h5> 
                    </Badge> 
                    ==== 
                    <Badge pill variant="info">
                      <h5>{aggregate.formattedEquivalentBalance} {aggregate.equivalentCurrency}</h5>
                    </Badge>
                    </Alert>
                  </ListGroup.Item>
                )
              }
            )
          }
          {
            noData && props.data &&
            <ListGroup.Item>
             <NoData />
            </ListGroup.Item>
          }
          {
            props.sum && props.sumCurrency &&
            <ListGroup.Item>
              <Alert variant="dark" className="text-center">
                <h5>{props.sum} {props.sumCurrency}</h5>
              </Alert>
            </ListGroup.Item>
          }
        </ListGroup>
        }
        </React.Fragment>
    )
} 

export default HomeDetails;