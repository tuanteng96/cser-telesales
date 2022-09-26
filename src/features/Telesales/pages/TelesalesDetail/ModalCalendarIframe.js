import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

ModalCalendarIframe.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func
}

function ModalCalendarIframe({ show, onHide }) {
  return (
    <Modal
      show={show}
      fullscreen={true}
      onHide={onHide}
      contentClassName="rounded-0"
    >
      <Modal.Header closeButton>
        <Modal.Title>Bảng lịch</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <iframe
          className="w-100 h-100"
          src="/admin/bookadmin/index.html?isTelesales=true"
          frameBorder="0"
          title="Bảng lịch cho Sales"
        ></iframe>
      </Modal.Body>
    </Modal>
  )
}

export default ModalCalendarIframe
