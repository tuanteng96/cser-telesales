import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import Skeleton from 'react-loading-skeleton'
import PerfectScrollbar from 'react-perfect-scrollbar'

import moment from 'moment'
import 'moment/locale/vi'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function NotiListMember(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [List, setList] = useState([])

  useEffect(() => {
    getNotiList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNotiList = (isLoading = true, callback) => {
    isLoading && setLoading(true)
    telesalesApi
      .getListMemberNoteTelesales(MemberID)
      .then(({ data }) => {
        setList(data?.data?.NotiServices || [])
        setLoading(false)
        callback && callback()
      })
      .catch(error => console.log(error))
  }

  return (
    <div className="border-bottom">
      <div className="text-uppercase d-flex justify-content-between align-items-center pt-18px pl-18px pr-18px pb-10px">
        <span className="fw-600 text-primary">Ghi chú</span>
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
                  <div className="d-flex fw-500" style={{ gap: '5px' }}>
                    <span className="font-number">
                      {moment(item.CreateDate).format('HH:mm DD-MM-YYYY')}
                    </span>
                    <span>-</span>
                    <span>{item.User.FullName}</span>
                    {item.IsImportant && (
                      <span className="text-danger">(Quan trọng)</span>
                    )}
                  </div>

                  <div
                    className="mt-5px fw-300"
                    dangerouslySetInnerHTML={{ __html: item.Content }}
                  ></div>
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
                    Không có ghi chú.
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

export default NotiListMember
