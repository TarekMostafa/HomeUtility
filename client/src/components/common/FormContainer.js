import React from 'react';
import { Card } from 'react-bootstrap';

function FormContainer(props){
  return (
    <Card>
      <Card.Header><h4>{props.title}</h4></Card.Header>
      {
        props.children && <Card.Body>{props.children}</Card.Body>
      }
    </Card>
  )
}

export default FormContainer;
