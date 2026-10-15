import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useOutletContext, useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import Skeleton from 'react-loading-skeleton'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PickerCareHistory from './PickerCareHistory'

import moment from 'moment'
import 'moment/locale/vi'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function CareHistory(props) {
  let { MemberID } = useParams()
  const { onRefresh } = useOutletContext()
  const [loading, setLoading] = useState(false)
  const [List, setList] = useState([])

  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv || false
  }))

  useEffect(() => {
    getCareHistoryList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCareHistoryList = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    const filters = {
      filter: {
        MemberID: MemberID
      },
      pi: 1,
      ps: 1000
    }
    telesalesApi
      .getCareHistory(filters)
      .then(({ data }) => {
        setList(data.data ? data.data.filter(x => x.Type === 'PROCESS') : [])
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  const onDelete = item => {
    const newData = {
      delete: [item.ID]
    }
    Swal.fire({
      title: 'Thực hiện xóa ?',
      html: `Bạn đang thực hiện xóa lịch sử này không.`,
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: 'bg-danger'
      },
      preConfirm: () =>
        new Promise((resolve, reject) => {
          telesalesApi
            .addCareHistory(newData)
            .then(response => {
              onRefresh()
              getCareHistoryList(false, () => {
                window.top?.toastr &&
                  window.top?.toastr.success('Xóa lịch sử thành công', '', {
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

  return (
    <div className="border-bottom">
      <div className="text-uppercase d-flex justify-content-between align-items-center pt-18px pl-18px pr-18px pb-10px">
        <span className="fw-600 text-primary">Lịch sử chăm sóc</span>
        <PickerCareHistory
          memberId={MemberID}
          onSaved={() => {
            onRefresh()
            getCareHistoryList(false)
          }}
        >
          {({ open }) => (
            <button
              type="button"
              className="btn btn-xs btn-success"
              onClick={open}
            >
              Thêm mới
            </button>
          )}
        </PickerCareHistory>
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
                  <span className="font-number fw-500">
                    <Skeleton count={1} width={130} height={15} />
                  </span>
                  <span className="fw-500">
                    <Skeleton count={1} width={80} height={15} />
                  </span>
                </div>
                <div className="mt-5px fw-300">
                  <Skeleton count={3} height={15} />
                </div>
              </div>
            ))}
        {!loading && (
          <>
            {List && List.length > 0 ? (
              List.map((item, index) => (
                <div
                  className={clsx(
                    'bg-light rounded-sm p-15px',
                    List.length - 1 !== index && 'mb-12px'
                  )}
                  key={index}
                >
                  <div className="d-flex justify-content-between">
                    <span className="font-number fw-500">
                      {moment(item.CreateDate).format('HH:mm DD-MM-YYYY')}
                    </span>

                    {(teleAdv ||
                      moment(item.CreateDate).format('DD-MM-YYYY') ===
                        moment().format('DD-MM-YYYY')) && (
                      <span
                        className="cursor-pointer fw-500 text-danger text-underline font-size-sm"
                        onClick={() => onDelete(item)}
                      >
                        Xóa
                      </span>
                    )}
                  </div>
                  {item.Result && (
                    <div className="mt-8px fw-500">
                      <span className="text-danger">{item.Result}</span>
                      <span className="pl-5px">- {item.TeleName}</span>
                    </div>
                  )}
                  <div className="mt-5px fw-300">{item.Content}</div>
                </div>
              ))
            ) : (
              <div className="w-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <img
                    className="w-100 max-w-120px"
                    src={AssetsHelpers.toAbsoluteUrl(
                      '/_assets/images/data-empty.png'
                    )}
                    alt="Không có dữ liệu"
                  />
                  <div className="text-center font-size-base fw-300">
                    Không có lịch nhắc.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PerfectScrollbar>
    </div>
  )
}

export default CareHistory
