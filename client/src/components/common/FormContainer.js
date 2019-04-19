import React from 'react';
import { Card } from 'react-bootstrap';

function FormContainer(props){
  return (
    <Card>
      {
        props.title &&
        <Card.Header>
          <span className="h4">{props.title}</span>
          {
            props.toolbar && <span className="float-right">{props.toolbar}</span>
          }
        </Card.Header>
      }
      {
        props.children && <Card.Body>{props.children}</Card.Body>
      }
    </Card>
  )
}

export default FormContainer;
