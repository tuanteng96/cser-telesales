import clsx from 'clsx'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PickerModal from './PickerModal'
import { useRoles } from 'src/hooks/useRoles'
import telesalesApi from 'src/api/telesales.api'
import MemberTransfer from 'src/features/Telesales/pages/TelesalesList/components/MemberTransfer'
import MemberTransferImport from 'src/features/Telesales/pages/TelesalesList/components/MemberTransferImport'
import ModalCalendarIframe from 'src/features/Telesales/pages/TelesalesDetail/ModalCalendarIframe'

const navLinkClassName = ({ isActive }) =>
  clsx(
    'tw-px-4 tw-h-12 tw-border-[1px] tw-border-solid tw-text-[14px] tw-font-medium tw-transition-all tw-inline-flex tw-items-center tw-justify-center tw-no-underline first:tw-rounded-l-lg last:tw-rounded-r-lg',
    isActive
      ? 'tw-relative tw-z-10 tw-bg-[#3699ff] tw-text-white tw-border-[#3699ff] hover:tw-bg-[#2585e6] hover:tw-border-[#2585e6] hover:tw-text-white focus:tw-text-white'
      : 'tw-bg-white tw-text-[#374151] tw-border-[#d3d3d3] hover:tw-relative hover:tw-z-10 hover:tw-bg-[#2585e6] hover:tw-text-white hover:tw-border-[#2585e6]'
  )

function Navbar({ ExportExcel, IsLoadingEx, onOpenSidebar, onRefresh }) {
  const [btnLoading, setBtnLoading] = useState(false)
  const [btnLoadingImport, setBtnLoadingImport] = useState(false)
  const [btnLoadingReset, setBtnLoadingReset] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isModalImport, setIsModalImport] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { AuthID } = useSelector(({ auth }) => ({
    AuthID: auth?.Info?.User?.ID
  }))

  const { nang_cao_tele } = useRoles({ nameRoles: ['nang_cao_tele'] })
  // const hasSettings = Boolean(
  //   nang_cao_tele?.hasRight && (onRefresh || nang_cao_tele?.IsAllStock)
  // )

  const onSubmitTransfer = (values, { resetForm }) => {
    setBtnLoading(true)
    const dataSubmit = {
      FromTeleUserID: values.FromTeleUserID ? values.FromTeleUserID.value : '',
      ToTeleUserID: values.ToTeleUserID ? values.ToTeleUserID.value : ''
    }
    telesalesApi
      .transferMember(dataSubmit)
      .then(response => {
        onRefresh(() => {
          setBtnLoading(false)
          resetForm()
          onHideModal()
          window.top?.toastr &&
            window.top?.toastr.success('Chuyển đổi thành công', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onSubmitTransferImport = (values, { resetForm }) => {
    setBtnLoadingImport(true)
    const dataSubmit = {
      ...values,
      users: values.users ? values.users.map(x => x.value).join(',') : ''
    }

    telesalesApi
      .transferMemberImport(dataSubmit)
      .then(response => {
        onRefresh(() => {
          setBtnLoadingImport(false)
          resetForm()
          onHideModalImport()
          window.top?.toastr &&
            window.top?.toastr.success('Chuyển đổi thành công', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onResetMember = () => {
    setBtnLoadingReset(true)
    telesalesApi
      .transferMemberReset()
      .then(response => {
        onRefresh(() => {
          setBtnLoadingReset(false)
          onHideModalImport()
          window.top?.toastr &&
            window.top?.toastr.success('Chuyển đổi thành công', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onOpenModal = () => {
    setIsModal(true)
  }

  const onHideModal = () => {
    setIsModal(false)
  }

  const onOpenModalImport = () => {
    setIsModalImport(true)
  }

  const onHideModalImport = () => {
    setIsModalImport(false)
  }

  return (
    <div className="tw-flex tw-justify-between tw-gap-2 tw-px-[16px] tw-py-[16px] tw-bg-[#f8f8fb] tw-rounded-t-lg">
      <div className="tw-flex -tw-space-x-px tw-shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] tw-rounded-lg">
        <NavLink to="/danh-sach" className={navLinkClassName}>
          {/* <i className="far fa-list pr-5px"></i> */}
          Danh sách khách hàng
        </NavLink>
        <NavLink to="/thong-ke/danh-sach" className={navLinkClassName}>
          Lịch sử chăm sóc
        </NavLink>
        <NavLink to="/lich-nhac/danh-sach" className={navLinkClassName}>
          Danh sách lịch nhắc
        </NavLink>
        <button
          type="button"
          className={navLinkClassName({ isActive: isCalendarOpen })}
          onClick={() => setIsCalendarOpen(true)}
          aria-haspopup="dialog"
        >
          Bảng lịch
        </button>
      </div>
      <ModalCalendarIframe
        show={isCalendarOpen}
        onHide={() => setIsCalendarOpen(false)}
      />
      <div className="tw-flex tw-justify-end tw-gap-2">
        {(window?.top?.GlobalConfig?.Admin?.byAdminExcel
          ? AuthID === 1
          : !window?.top?.GlobalConfig?.Admin?.byAdminExcel) && (
          <button
            id="export-excel"
            className={clsx(
              'after:tw-hidden disabled:tw-opacity-40 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-border-[1px] tw-border-solid !tw-border-[#d3d3d3] tw-h-12 tw-rounded-[6px] tw-bg-white hover:!tw-bg-[#f5f5f5] hover:!tw-text-[#107c41] tw-transition-all tw-px-3 tw-gap-2 tw-shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] tw-font-medium !tw-text-gray-700 btn btn-success',
              IsLoadingEx && 'spinner spinner-white spinner-right'
            )}
            type="button"
            onClick={ExportExcel}
            disabled={IsLoadingEx}
          >
            Xuất Excel
            <svg
              className="tw-w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 13L12 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 13L8 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 13H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 17H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            bsPrefix="navbar-settings-toggle"
            id="navbar-settings-dropdown"
            aria-label="Mở cài đặt"
            className="after:tw-hidden disabled:tw-opacity-40 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-border-[1px] tw-border-solid tw-border-[#d3d3d3] tw-h-12 tw-rounded-[6px] tw-bg-white hover:tw-bg-[#f5f5f5] tw-transition-all tw-px-3 tw-py-0 tw-gap-2 tw-shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] tw-text-[14px] tw-font-medium tw-text-gray-700"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw-w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Dropdown.Toggle>
          {createPortal(
            <Dropdown.Menu
              popperConfig={{ strategy: 'fixed' }}
              style={{ zIndex: 1060 }}
            >
              {onRefresh && (
                <>
                  <Dropdown.Item
                    className="tw-py-2.5 tw-active:!text-white"
                    as="button"
                    type="button"
                    eventKey="transfer"
                    onClick={() => {
                      if (nang_cao_tele?.hasRight) {
                        onOpenModal()
                      } else {
                        window.top?.toastr &&
                          window.top?.toastr.error(
                            'Bạn không có quyền truy cập chức năng này.',
                            '',
                            {
                              timeOut: 1500
                            }
                          )
                      }
                    }}
                  >
                    Chuyển đổi khách hàng
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="tw-py-2.5 tw-active:!text-white"
                    as="button"
                    type="button"
                    eventKey="import"
                    onClick={() => {
                      if (nang_cao_tele?.hasRight) {
                        onOpenModalImport()
                      } else {
                        window.top?.toastr &&
                          window.top?.toastr.error(
                            'Bạn không có quyền truy cập chức năng này.',
                            '',
                            {
                              timeOut: 1500
                            }
                          )
                      }
                    }}
                  >
                    Import khách hàng
                  </Dropdown.Item>
                </>
              )}

              <PickerModal>
                {({ open }) => (
                  <Dropdown.Item
                    onClick={() => {
                      if (
                        nang_cao_tele?.hasRight &&
                        nang_cao_tele?.IsAllStock
                      ) {
                        open()
                      } else {
                        window.top?.toastr &&
                          window.top?.toastr.error(
                            'Bạn không có quyền truy cập chức năng này.',
                            '',
                            {
                              timeOut: 1500
                            }
                          )
                      }
                    }}
                    className="tw-py-2.5 tw-active:!text-white"
                    as="button"
                    type="button"
                    eventKey="demo-3"
                  >
                    Cài đặt phân loại
                  </Dropdown.Item>
                )}
              </PickerModal>
            </Dropdown.Menu>,
            document.body
          )}
        </Dropdown>

        {nang_cao_tele?.hasRight && onRefresh && (
          <>
            <MemberTransfer
              show={isModal}
              loading={btnLoading}
              onSubmit={onSubmitTransfer}
              onHide={onHideModal}
            />
            <MemberTransferImport
              show={isModalImport}
              loading={btnLoadingImport}
              onSubmit={onSubmitTransferImport}
              onHide={onHideModalImport}
              onResetMember={onResetMember}
              loadingReset={btnLoadingReset}
            />
          </>
        )}

        <button
          type="button"
          className="tw-flex lg:tw-hidden after:tw-hidden disabled:tw-opacity-40 tw-cursor-pointer tw-items-center tw-justify-center tw-border-[1px] tw-border-solid tw-border-[#d3d3d3] tw-h-12 tw-rounded-[6px] tw-bg-white hover:tw-bg-[#f5f5f5] tw-transition-all tw-px-3 tw-py-0 tw-gap-2 tw-shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] tw-text-[14px] tw-font-medium tw-text-gray-700"
          onClick={onOpenSidebar}
          aria-label="Mở bộ lọc"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="tw-w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Navbar
