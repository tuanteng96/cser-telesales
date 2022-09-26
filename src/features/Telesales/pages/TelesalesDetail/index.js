import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import { PriceHelper } from 'src/helpers/PriceHelper'
import PerfectScrollbar from 'react-perfect-scrollbar'
import NoteMember from './NoteMember'
import ProgressList from './ProgressList'
import TelesalesOption from '../TelesalesOption'
import Skeleton from 'react-loading-skeleton'
import InterestedProducts from './InterestedProducts'
import CareHistory from './CareHistory'
import uuid from 'react-uuid'
import CalendarMember from './CalendarMember'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function TelesalesDetail(props) {
  let { MemberID } = useParams()

  const [ListProds, setListProds] = useState([])
  const [MemberCurrent, setMemberCurrent] = useState(null)
  const [loadingMember, setLoadingMember] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getMemberTelesales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MemberID])

  const getMemberTelesales = () => {
    setLoadingMember(true)
    telesalesApi
      .getMemberIDTelesales(MemberID)
      .then(({ data }) => {
        if (data.error) {
          navigate('/danh-sach')
        } else {
          setListProds(() => data.prods.map(item => ({ ...item, Ids: uuid() })))
          setMemberCurrent(data.member)
          setLoadingMember(false)
        }
      })
      .catch(error => console.log(error))
  }
  //console.log(MemberCurrent)
  return (
    <div className="d-flex h-100 telesales-list">
      <div className="telesales-list__sidebar bg-white">
        <div className="border-bottom px-18px py-15px text-uppercase fw-600 font-size-lg d-flex align-items-center">
          <div
            className="w-40px h-40px border rounded-circle cursor-pointer position-relative mr-10px"
            onClick={() => navigate('/danh-sach')}
          >
            <i className="fa-regular fa-arrow-left position-absolute left-12px top-12px"></i>
          </div>
          Thông tin khách hàng
        </div>
        <div className="p-18px">
          <div className="d-flex justify-content-center">
            <div className="w-85px position-relative">
              <img
                className="w-100 rounded-sm shadow"
                src="https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_1.jpg"
                alt=""
              />
            </div>
            <div className="flex-fill pl-15px">
              <div className="text-capitalize fw-700 font-size-md mb-3px line-height-sm text-primary">
                {loadingMember && (
                  <Skeleton count={1} width={150} height={20} />
                )}
                {!loadingMember && MemberCurrent?.FullName}
              </div>
              <div className="font-number fw-600 font-size-base">
                {loadingMember && (
                  <Skeleton count={1} width={150} height={18} />
                )}
                {!loadingMember && MemberCurrent?.MobilePhone}
              </div>
              <div className="btn btn-sm btn-primary mr-2 py-6px px-3 px-xxl-3 fw-500 mt-8px">
                <i className="fa-solid fa-phone pr-5px"></i>
                Gọi điện
              </div>
            </div>
          </div>
          <div className="mt-20px">
            <div className="d-flex justify-content-between mb-8px">
              <div className="font-label">Cơ sở</div>
              <div className="fw-600">
                {loadingMember && <Skeleton count={1} width={100} />}
                {!loadingMember && (MemberCurrent?.ByStock?.Title || 'Chưa có')}
              </div>
            </div>
            <div className="d-flex justify-content-between mb-8px">
              <div className="font-label">Loại</div>
              <div className="fw-600">
                {MemberCurrent?.GroupNames || 'Chưa có nhóm'}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="font-label">Sinh nhật</div>
              <div className="fw-600 font-number">
                {loadingMember && <Skeleton count={1} width={100} />}
                {!loadingMember && MemberCurrent?.BirthDate
                  ? moment(MemberCurrent?.BirthDate).format('DD-MM-YYYY')
                  : 'Chưa có'}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap px-10px border-top pt-10px">
          <div className="w-50 p-8px">
            <div className="border rounded-sm d-flex align-items-center flex-column px-10px py-15px">
              <div className="text-uppercase font-size-min fw-700 text-muted">
                Ví điện tử
              </div>
              <div className="font-number font-size-md fw-600 mt-3px">
                {loadingMember && <Skeleton count={1} width={50} height={22} />}
                {!loadingMember &&
                  PriceHelper.formatVND(MemberCurrent?.Present?.nap_vi)}
              </div>
            </div>
          </div>
          <div className="w-50 p-8px">
            <div className="border rounded-sm d-flex align-items-center flex-column px-10px py-15px">
              <div className="text-uppercase font-size-min fw-700 text-muted">
                Thẻ tiền
              </div>
              <div className="font-number font-size-md fw-600 mt-3px">
                {loadingMember && <Skeleton count={1} width={50} height={22} />}
                {!loadingMember &&
                  PriceHelper.formatVND(
                    MemberCurrent?.Present?.the_tien_kha_dung
                  )}
              </div>
            </div>
          </div>
          <div className="w-50 p-8px">
            <div className="border rounded-sm d-flex align-items-center flex-column px-10px py-15px">
              <div className="text-uppercase font-size-min fw-700 text-muted">
                Đã chi tiêu
              </div>
              <div className="font-number font-size-md fw-600 mt-3px">
                {loadingMember && <Skeleton count={1} width={50} height={22} />}
                {!loadingMember &&
                  PriceHelper.formatVND(MemberCurrent?.Present?.da_chi_tieu)}
              </div>
            </div>
          </div>
          <div className="w-50 p-8px">
            <div className="border rounded-sm d-flex align-items-center flex-column px-10px py-15px">
              <div className="text-uppercase font-size-min fw-700 text-muted">
                Công nợ
              </div>
              <div className="font-number font-size-md fw-600 mt-3px text-danger">
                {loadingMember && <Skeleton count={1} width={50} height={22} />}
                {!loadingMember &&
                  PriceHelper.formatVND(MemberCurrent?.Present?.no)}
              </div>
            </div>
          </div>
        </div>
        <NoteMember
          initialValues={MemberCurrent?.TeleNote}
          loading={loadingMember}
        />
      </div>
      <div className="telesales-list__content flex-fill d-flex flex-column bg-white border-left">
        <ProgressList
          initialValues={MemberCurrent?.TeleTags}
          MemberLoading={loadingMember}
        />
        <div className="d-flex telesales-detail-body">
          <div className="w-425px border-right">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="scroll h-100"
              style={{ position: 'relative' }}
            >
              <InterestedProducts />
              <CalendarMember />
              <CareHistory />
            </PerfectScrollbar>
          </div>
          <div className="flex-fill">
            <TelesalesOption ListProds={ListProds} loading={loadingMember} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelesalesDetail
