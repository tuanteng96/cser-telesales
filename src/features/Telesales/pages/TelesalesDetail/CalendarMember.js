import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import ModalCalendarIframe from './ModalCalendarIframe'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import CalendarMemberBook from './CalendarMemberBook'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function CalendarMember(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [ListBooks, setListBooks] = useState([])
  const [isModalCalendar, setIsModalCalendar] = useState(false)
  const [isModalBook, setIsModalBook] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
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
      From: moment().format('YYYY-MM-DD'),
      To: moment().add(50, 'year').format('YYYY-MM-DD'),
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

  const onSubmit = async (values, { resetForm }) => {
    setBtnLoading(true)
    const objBooking = {
      ...values,
      MemberID: MemberID,
      RootIdS: values.RootIdS.map(item => item.value).toString(),
      UserServiceIDs:
        values.UserServiceIDs && values.UserServiceIDs.length > 0
          ? values.UserServiceIDs.map(item => item.value).toString()
          : '',
      BookDate: moment(values.BookDate).format('YYYY-MM-DD HH:mm'),
      Status: 'XAC_NHAN'
    }

    const CurrentStockID = Cookies.get('StockID')
    const u_id_z4aDf2 = Cookies.get('u_id_z4aDf2')

    try {
      const dataPost = {
        booking: [objBooking]
      }
      await telesalesApi.addMemberBooking(dataPost, {
        CurrentStockID,
        u_id_z4aDf2
      })
      getListBook(false, () => {
        window.top?.toastr &&
          window.top?.toastr.success('Đặt lịch thành công', '', {
            timeOut: 1500
          })
        onHideModalBook()
        setBtnLoading(false)
        resetForm()
      })
    } catch (error) {
      setBtnLoading(prevState => ({
        ...prevState,
        isBtnBooking: false
      }))
    }
  }

  const onDelete = item => {
    const CurrentStockID = Cookies.get('StockID')
    const u_id_z4aDf2 = Cookies.get('u_id_z4aDf2')

    const dataPost = {
      booking: [
        {
          ...item,
          MemberID: item.MemberID.value,
          RootIdS: item.RootIds,
          UserServiceIDs: item.UserServiceIDs,
          BookDate: moment(item.BookDate).format('YYYY-MM-DD HH:mm'),
          Status: 'TU_CHOI'
        }
      ]
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

  const onOpenModal = () => {
    setIsModalCalendar(true)
  }

  const onHideModal = () => {
    setIsModalCalendar(false)
  }

  const onOpenModalBook = () => {
    setIsModalBook(true)
  }

  const onHideModalBook = () => {
    setIsModalBook(false)
  }

  return (
    <div className="border-bottom p-18px">
      <div className="text-uppercase d-flex justify-content-between align-items-center">
        <span className="fw-600 text-primary">Đặt lịch khách hàng</span>
        <div className="d-flex">
          <button
            className="btn btn-xs btn-primary mr-5px"
            onClick={onOpenModal}
          >
            Bảng lịch
          </button>
          <button className="btn btn-xs btn-success" onClick={onOpenModalBook}>
            Đặt lịch
          </button>
        </div>
      </div>
      <div>
        {loading &&
          Array(1)
            .fill()
            .map((item, index) => (
              <div className="bg-light rounded-sm p-15px mt-12px" key={index}>
                <div className="d-flex justify-content-between">
                  <div>
                    <Skeleton count={1} width={130} height={15} />
                  </div>
                  <span className="fw-500 text-danger cursor-pointer text-underline font-size-sm">
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
                <div className="bg-light rounded-sm p-15px mt-12px" key={index}>
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
                      className="fw-500 text-danger cursor-pointer text-underline font-size-sm"
                      onClick={() => onDelete(item)}
                    >
                      Hủy lịch
                    </span>
                  </div>
                  <div className="mt-5px fw-500">{item.RootTitles}</div>
                </div>
              ))
            ) : (
              <div>Không có lịch</div>
            )}
          </>
        )}
      </div>
      <CalendarMemberBook
        show={isModalBook}
        onHide={onHideModalBook}
        btnLoading={btnLoading}
        onSubmit={onSubmit}
      />
      <ModalCalendarIframe show={isModalCalendar} onHide={onHideModal} />
    </div>
  )
}

export default CalendarMember
