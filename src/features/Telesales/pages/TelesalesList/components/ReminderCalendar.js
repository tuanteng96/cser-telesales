import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

ReminderCalendar.propTypes = {
  onHide: PropTypes.func
}

function ReminderCalendar({ onHide, show }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-content-right max-w-400px"
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase">Lịch nhắc</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="reminder-item">
          <div className="reminder-item__name">
            <span>Nguyễn Tài Tuấn</span>
          </div>
          <div className="px-15px">
            <div className="bg-light rounded-sm p-15px mt-10px">
              <div className="d-flex justify-content-between">
                <span className="font-number fw-500">14:32 08-12-2022</span>
                <div>
                  <span className="fw-500 text-success cursor-pointer text-underline font-size-sm mr-8px">
                    Sửa
                  </span>
                  <span className="fw-500 text-danger cursor-pointer text-underline font-size-sm">
                    Xóa
                  </span>
                </div>
              </div>
              <div className="mt-8px fw-500">
                Ngày nhắc<span className="pl-5px">03-12-2022</span>
                <span className="pl-5px font-size-xs text-success">
                  - Đã nhắc
                </span>
              </div>
              <div className="mt-5px fw-300">
                Nội dung : <span className="fw-500">adadadad</span>
              </div>
            </div>
            <div className="bg-light rounded-sm p-15px mt-10px">
              <div className="d-flex justify-content-between">
                <span className="font-number fw-500">14:32 08-12-2022</span>
                <div>
                  <span className="fw-500 text-success cursor-pointer text-underline font-size-sm mr-8px">
                    Sửa
                  </span>
                  <span className="fw-500 text-danger cursor-pointer text-underline font-size-sm">
                    Xóa
                  </span>
                </div>
              </div>
              <div className="mt-8px fw-500">
                Ngày nhắc<span className="pl-5px">03-12-2022</span>
              </div>
              <div className="mt-5px fw-300">
                Nội dung : <span className="fw-500">adadadad</span>
              </div>
            </div>
          </div>
        </div>
        <div className="reminder-item">
          <div className="reminder-item__name">
            <span>Nguyễn Tài Tuấn</span>
          </div>
          <div className="px-15px">
            <div className="bg-light rounded-sm p-15px mt-10px">
              <div className="d-flex justify-content-between">
                <span className="font-number fw-500">14:32 08-12-2022</span>
                <div>
                  <span className="fw-500 text-success cursor-pointer text-underline font-size-sm mr-8px">
                    Sửa
                  </span>
                  <span className="fw-500 text-danger cursor-pointer text-underline font-size-sm">
                    Xóa
                  </span>
                </div>
              </div>
              <div className="mt-8px fw-500">
                Ngày nhắc<span className="pl-5px">03-12-2022</span>
                <span className="pl-5px font-size-xs text-success">
                  - Đã nhắc
                </span>
              </div>
              <div className="mt-5px fw-300">
                Nội dung : <span className="fw-500">adadadad</span>
              </div>
            </div>
            <div className="bg-light rounded-sm p-15px mt-10px">
              <div className="d-flex justify-content-between">
                <span className="font-number fw-500">14:32 08-12-2022</span>
                <div>
                  <span className="fw-500 text-success cursor-pointer text-underline font-size-sm mr-8px">
                    Sửa
                  </span>
                  <span className="fw-500 text-danger cursor-pointer text-underline font-size-sm">
                    Xóa
                  </span>
                </div>
              </div>
              <div className="mt-8px fw-500">
                Ngày nhắc<span className="pl-5px">03-12-2022</span>
              </div>
              <div className="mt-5px fw-300">
                Nội dung : <span className="fw-500">adadadad</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ReminderCalendar
