import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ModalContainer(props){
  return (
    <Modal aria-labelledby="contained-modal-title-vcenter"
      centered show={props.show} onHide={props.onHide}
      backdrop={'static'} onShow={props.onShow} {...props}>
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

ModalContainer.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};

ModalContainer.defaultProps = {
  show: false,
  onHide: () => {},
  onShow: () => {},
  title: '',
  children: '',
  footer: '',
}

export default ModalContainer;
