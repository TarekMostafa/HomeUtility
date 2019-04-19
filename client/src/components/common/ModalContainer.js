import React from 'react';
import { Modal } from 'react-bootstrap';

function ModalContainer(props){
  return (
    <Modal aria-labelledby="contained-modal-title-vcenter"
      centered show={props.show} onHide={props.onHide}
      backdrop={'static'} onShow={props.onShow}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      {
        props.children &&
        <Modal.Body>
          {props.children}
        </Modal.Body>
      }
      {
        props.footer &&
        <Modal.Footer>
          {props.footer}
        </Modal.Footer>
      }
    </Modal>
  )
}

export default ModalContainer;
