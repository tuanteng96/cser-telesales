import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import ModalCalendarIframe from './ModalCalendarIframe'
import PerfectScrollbar from 'react-perfect-scrollbar'

import moment from 'moment'
import 'moment/locale/vi'
import clsx from 'clsx'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function CalendarMember({ MemberCurrent }) {
  let { MemberID } = useParams()
  const { onRefresh } = useOutletContext()
  const [loading, setLoading] = useState(false)
  const [ListBooks, setListBooks] = useState([])
  const [isModalBook, setIsModalBook] = useState(false)
  const { AuthCrStockID } = useSelector(({ auth }) => ({
    AuthCrStockID: auth?.Info?.CrStockID
  }))
  useEffect(() => {
    getListBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListBook = (isLoading = true, callback) => {
    const filters = {
      MemberID: MemberID,
      From: moment().subtract(10, 'days').format('YYYY-MM-DD'),
      To: moment().add(20, 'days').format('YYYY-MM-DD'),
      StockID: AuthCrStockID
    }
    isLoading && setLoading(true)
    telesalesApi
      .getListBookMember(filters)
      .then(({ data }) => {
        setListBooks(data.books)
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const onDelete = item => {
    const CurrentStockID = Cookies.get('StockID')
    const u_id_z4aDf2 = Cookies.get('u_id_z4aDf2')

    let objBooking = {
      ...item,
      MemberID: item.Member.ID,
      RootIdS: item.RootIds,
      UserServiceIDs: item.UserServiceIDs,
      BookDate: moment(item.BookDate).format('YYYY-MM-DD HH:mm'),
      Status: 'TU_CHOI',
      InfoMore: {
        Member: {
          ID: MemberCurrent?.ID || '',
          FullName: MemberCurrent?.FullName || '',
          MobilePhone: MemberCurrent?.MobilePhone || ''
        },
        Roots: item.Roots
          ? item.Roots.map(x => ({
              ID: x.ID,
              Title: x.Title
            }))
          : null
      }
    }

    let History = {
      ...(item?.History || {}),
      Edit: item?.History?.Edit
        ? [
            ...item?.History?.Edit,
            {
              CreateDate: moment().format('HH:mm DD-MM-YYYY'),
              Staff: {
                ID: window?.top?.Info?.User?.ID,
                FullName: window?.top?.Info?.User?.FullName
              },
              Booking: {
                ...objBooking,
                UserServices: item.UserServices,
                Roots: item.Roots,
                Members: {
                  label: item?.Member?.FullName,
                  value: item?.Member?.ID,
                  phone: item?.Member?.MobilePhone,
                  FullName: item?.Member?.FullName,
                  ID: item?.Member?.ID
                }
              },
              isCSKH: true
            }
          ]
        : [
            {
              CreateDate: moment().format('HH:mm DD-MM-YYYY'),
              Staff: {
                ID: window?.top?.Info?.User?.ID,
                FullName: window?.top?.Info?.User?.FullName
              },
              Booking: {
                ...objBooking,
                UserServices: item.UserServices,
                Roots: item.Roots,
                Members: {
                  label: item?.Member?.FullName,
                  value: item?.Member?.ID,
                  phone: item?.Member?.MobilePhone,
                  FullName: item?.Member?.FullName,
                  ID: item?.Member?.ID
                }
              },
              isCSKH: true
            }
          ]
    }

    objBooking.History = History

    const dataPost = {
      booking: [objBooking]
    }
    Swal.fire({
      title: 'Thực hiện hủy lịch ?',
      html: `Bạn đang thực hiện hủy lịch vào ${moment(item.BookDate).format(
        'HH:mm DD-MM-YYYY'
      )} này không.`,
      showCancelButton: true,
      confirmButtonText: 'Hủy ngay',
      cancelButtonText: 'Không',
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: 'bg-danger'
      },
      preConfirm: () =>
        new Promise((resolve, reject) => {
          telesalesApi
            .addMemberBooking(dataPost, { CurrentStockID, u_id_z4aDf2 })
            .then(response => {
              onRefresh()
              getListBook(false, () => {
                window.top?.toastr &&
                  window.top?.toastr.success('Hủy lịch thành công', '', {
                    timeOut: 1500
                  })
                resolve()
              })
            })
            .catch(error => console.log(error))
        }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  const onOpenModalBook = () => {
    setIsModalBook(true)
  }

  const onHideModalBook = () => {
    setIsModalBook(false)
  }

  return (
    <div className="border-bottom">
      <div className="text-uppercase d-flex justify-content-between align-items-center pt-18px pl-18px pr-18px pb-10px">
        <span className="fw-600 text-primary">Đặt lịch khách hàng</span>
        <div className="d-flex">
          <button className="btn btn-xs btn-success" onClick={onOpenModalBook}>
            Đặt lịch
          </button>
        </div>
      </div>
      <PerfectScrollbar
        options={perfectScrollbarOptions}
        className="scroll pl-18px pr-18px pb-18px max-h-300px"
        style={{ position: 'relative' }}
      >
        {loading &&
          Array(1)
            .fill()
            .map((item, index) => (
              <div
                className={clsx(
                  'bg-light rounded-sm p-15px',
                  1 - 1 !== index && 'mb-12px'
                )}
                key={index}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <Skeleton count={1} width={130} height={15} />
                  </div>
                  <span className="cursor-pointer fw-500 text-danger text-underline font-size-sm">
                    <Skeleton count={1} width={80} height={15} />
                  </span>
                </div>
                <div className="mt-5px fw-500">
                  <Skeleton count={2} height={15} />
                </div>
              </div>
            ))}
        {!loading && (
          <>
            {ListBooks && ListBooks.length > 0 ? (
              ListBooks.map((item, index) => (
                <div
                  className={clsx(
                    'bg-light rounded-sm p-15px',
                    ListBooks.length - 1 !== index && 'mb-12px'
                  )}
                  key={index}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="font-number fw-500">
                        {moment(item.BookDate).format('HH:mm DD-MM-YYYY')}
                      </span>
                      <span className="fw-500 text-success font-size-sm pl-5px">
                        Đã xác nhận
                      </span>
                    </div>
                    <span
                      className="cursor-pointer fw-500 text-danger text-underline font-size-sm"
                      onClick={() => onDelete(item)}
                    >
                      Hủy lịch
                    </span>
                  </div>
                  <div className="mt-5px fw-500">{item.RootTitles}</div>
                </div>
              ))
            ) : (
              <div className="w-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  {/* <img
                    className="w-100 max-w-120px"
                    src={AssetsHelpers.toAbsoluteUrl(
                      '/_assets/images/data-empty.png'
                    )}
                    alt="Không có dữ liệu"
                  /> */}
                  <div className="text-center font-size-base fw-300">
                    Không có lịch.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PerfectScrollbar>
      {isModalBook && (
        <ModalCalendarIframe
          show
          newBooking
          member={MemberCurrent}
          onHide={() => {
            onHideModalBook()
            onRefresh()
            getListBook(false)
            window.getMemberTelesales && window.getMemberTelesales()
          }}
        />
      )}
    </div>
  )
}

export default CalendarMember
