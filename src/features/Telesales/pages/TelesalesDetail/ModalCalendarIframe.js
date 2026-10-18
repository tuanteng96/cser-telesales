import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

ModalCalendarIframe.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  newBooking: PropTypes.bool,
  member: PropTypes.shape({
    ID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    FullName: PropTypes.string,
    MobilePhone: PropTypes.string
  })
}

function ModalCalendarIframe({ show, onHide, newBooking = false, member }) {
  const [loading, setLoading] = useState(false)
  const [frameLoaded, setFrameLoaded] = useState(false)
  useEffect(() => {
    setFrameLoaded(false)
    if (show) setLoading(true)
  }, [show])

  useEffect(() => {
    if (!show || !frameLoaded || !newBooking) return

    // The calendar may register NewBook in a React effect after iframe onLoad.
    const openBooking = () => {
      if (typeof window.top.NewBook !== 'function') return false
      if (member) {
        window.top.NewBook({
          MemberID: {
            value: member.ID,
            label: member.FullName || '',
            text: member.FullName || '',
            suffix: member.MobilePhone || ''
          }
        })
      } else {
        window.top.NewBook()
      }
      return true
    }
    if (openBooking()) return
    const timer = setInterval(() => {
      if (openBooking()) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [show, frameLoaded, newBooking, member])

  const handleIfrmeLoad = () => {
    setLoading(false)
    setFrameLoaded(true)
  }

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
        {loading && (
          <div className="top-0 left-0 position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
            Đang tải dữ liệu ...
          </div>
        )}
        <iframe
          onLoad={handleIfrmeLoad}
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
