import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Sidebar from './components/Sidebar'
import { Overlay, OverlayTrigger, Popover } from 'react-bootstrap'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import { TelesalesContext } from '../..'
import { useWindowSize } from 'src/hooks/useWindowSize'
import Text from 'react-texty'
import ReminderCalendar from './components/ReminderCalendar'
import clsx from 'clsx'
import Navbar from 'src/components/Navbar/Navbar'

import moment from 'moment'
import 'moment/locale/vi'
import { setFiltersTeles } from '../../TelesalesSlice'

moment.locale('vi')

function checkGG(fn) {
  if (
    window.GC &&
    window.GC.Spread &&
    window.GC.Spread.Excel &&
    window.GC.Spread.Excel.IO
  ) {
    fn()
  } else {
    setTimeout(() => {
      checkGG(fn)
    }, 50)
  }
}

const EditableCell = ({ rowData, container, showEditing, hideEditing }) => {
  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false
  }))
  const [Editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [value, setValue] = useState(
    rowData?.TeleUser?.ID > 0
      ? { label: rowData?.TeleUser?.FullName, value: rowData?.TeleUser?.ID }
      : null
  )
  const target = useRef(null)

  useEffect(() => {
    setValue(
      rowData?.TeleUser?.ID > 0
        ? { label: rowData?.TeleUser?.FullName, value: rowData?.TeleUser?.ID }
        : null
    )
  }, [rowData?.TeleUser])

  const handleClick = () => {
    if (!teleAdv) return
    setEditing(true)
    showEditing()
  }

  const handleHide = () => {
    setEditing(false)
    hideEditing()
  }

  const onSubmit = options => {
    setLoading(true)
    const newData = {
      items: [
        {
          MemberID: rowData.ID,
          TeleUserID: options ? options.value : null
        }
      ]
    }
    telesalesApi
      .setUserIDTelesales(newData)
      .then(response => {
        setValue(options)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }

  return (
    <div
      className="h-100 d-flex align-items-center cursor-pointer"
      ref={target}
      onClick={() => handleClick()}
    >
      {!Editing && (
        <>
          {value ? value.label : 'Chọn nhân viên'}
          {teleAdv && (
            <i className="fa-solid fa-user-pen pl-8px font-size-base text-muted"></i>
          )}
        </>
      )}
      {Editing && target && (
        <Overlay
          target={target.current}
          show={Editing}
          placement="right"
          //container={container}
          onHide={handleHide}
          rootClose
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                position: 'absolute',
                width: 220,
                ...props.style
              }}
            >
              <SelectStaffs
                isLoading={loading}
                className="select-control"
                //menuPosition="fixed"
                name="filter.tele_user_id"
                //menuIsOpen={true}
                onChange={otp => {
                  onSubmit(otp)
                }}
                value={value}
                isClearable={true}
                adv={true}
              />
            </div>
          )}
        </Overlay>
      )}
    </div>
  )
}

const columnsSort = window?.top?.GlobalConfig?.Admin?.kpiSortColumn || null

function TelesalesList(props) {
  const { User, teleAdv, CrStockID, filtersRedux } = useSelector(
    ({ auth, telesales }) => ({
      User: auth?.Info?.User,
      teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false,
      CrStockID: auth?.Info?.CrStockID || '',
      filtersRedux: telesales.filters
    })
  )
  const [ListTelesales, setListTelesales] = useState([])
  const [loading, setLoading] = useState(false)
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [IsEditing, setIsEditing] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [IsLoadingEx, setIsLoadingEx] = useState(false)

  const { onOpenSidebar } = useContext(TelesalesContext)
  const dispatch = useDispatch()

  const [filters, setFilters] = useState({
    filter: {
      tele_process: filtersRedux.tele_process || '', //Đang tiếp cận,Đặt lịch thành công
      tele_user_id: filtersRedux.tele_user_id
        ? filtersRedux.tele_user_id
        : !teleAdv
        ? {
            label: User.FullName,
            value: User.ID
          }
        : '',
      wishlist: filtersRedux.wishlist || '', // id,id san_pham
      birthDateFrom: filtersRedux.birthDateFrom || '', //31/12
      birthDateTo: filtersRedux.birthDateTo || '', //31/12
      bookDateFrom: filtersRedux.bookDateFrom || '', // dd/mm/yyyy
      bookDateTo: filtersRedux.bookDateTo || '', // dd/mm/yyyy
      last_used: filtersRedux.last_used || '',
      remains: filtersRedux.remains || '', //
      key: filtersRedux.key || '',
      emptyStaff: filtersRedux.emptyStaff || false,
      NotiFrom: filtersRedux.NotiFrom || '',
      NotiTo: filtersRedux.NotiTo || '',
      HasNoti: filtersRedux.HasNoti || false,
      StockID: filtersRedux.StockID || CrStockID,
      CreateFrom: filtersRedux.CreateFrom || '',
      CreateTo: filtersRedux.CreateTo || ''
    },
    pi: 1,
    ps: 20
  })

  const { width } = useWindowSize()
  const { pathname } = useLocation()

  useEffect(() => {
    getListTelesales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListTelesales = callback => {
    setLoading(true)
    let tele_user_id_new = ''
    if (filters.filter.emptyStaff) {
      tele_user_id_new = 0
    } else {
      tele_user_id_new = filters.filter.tele_user_id
        ? filters.filter.tele_user_id.value
        : ''
    }
    const newFilter = {
      ...filters,
      filter: {
        ...filters.filter,
        tele_user_id: tele_user_id_new,
        tele_process: filters.filter.tele_process
          ? filters.filter.tele_process.join(',')
          : '',
        wishlist: filters.filter.wishlist
          ? filters.filter.wishlist.map(wish => wish.value).join(',')
          : '',
        birthDateFrom: filters.filter.birthDateFrom
          ? moment(filters.filter.birthDateFrom).format('DD/MM')
          : '',
        birthDateTo: filters.filter.birthDateTo
          ? moment(filters.filter.birthDateTo).format('DD/MM')
          : '',
        bookDateFrom: filters.filter.bookDateFrom
          ? moment(filters.filter.bookDateFrom).format('DD/MM/YYYY')
          : '',
        bookDateTo: filters.filter.bookDateTo
          ? moment(filters.filter.bookDateTo).format('DD/MM/YYYY')
          : '',
        NotiFrom: filters.filter.NotiFrom
          ? moment(filters.filter.NotiFrom).format('DD/MM/YYYY')
          : '',
        NotiTo: filters.filter.NotiTo
          ? moment(filters.filter.NotiTo).format('DD/MM/YYYY')
          : '',
        CreateFrom: filters.filter.CreateFrom
          ? moment(filters.filter.CreateFrom).format('DD/MM/YYYY')
          : '',
        CreateTo: filters.filter.CreateTo
          ? moment(filters.filter.CreateTo).format('DD/MM/YYYY')
          : ''
      },
      pi: callback ? 1 : filters.pi
    }

    telesalesApi
      .getListMemberTelesales(newFilter)
      .then(({ data }) => {
        if (data.error) {
          setLoading(false)
          // Xử lí lỗi
        } else {
          const { List, PCount, Total } = {
            List: data?.data || [],
            Pcount: data?.pCount || 0,
            Total: data?.total || 0
          }
          if (filters.pi > 1) {
            setListTelesales(prevState => [...prevState, ...List])
          } else {
            setListTelesales(List)
          }
          setPageCount(PCount)
          setPageTotal(Total)
          setLoading(false)
          callback && callback()
        }
      })
      .catch(error => console.log(error))
  }

  const onRefresh = callback => {
    if (filters.pi > 1) {
      setFilters(prevState => ({ ...prevState, pi: 1 }))
      callback && callback()
    } else {
      getListTelesales(() => {
        callback && callback()
      })
    }
  }

  const columns = useMemo(
    () => {
      let newColumns = [
        {
          key: 'index',
          title: 'STT',
          dataKey: 'index',
          cellRenderer: ({ rowIndex }) => rowIndex + 1,
          width: 60,
          sortable: false,
          align: 'center'
        },
        {
          key: 'FullName',
          title: 'Họ và tên',
          dataKey: 'FullName',
          cellRenderer: ({ rowData }) => (
            <div>
              <div className="fw-600">{rowData?.FullName}</div>
              <div className="font-number">{rowData?.MobilePhone}</div>
            </div>
          ),
          width: 250,
          sortable: false
        },
        {
          key: 'CreateDate',
          title: 'Ngày tạo',
          dataKey: 'CreateDate',
          cellRenderer: ({ rowData }) => (
            <div>{moment(rowData?.CreateDate).format('DD-MM-YYYY')}</div>
          ),
          width: 180,
          sortable: false
        },
        {
          key: 'ByStock.Title',
          title: 'Cơ sở',
          dataKey: 'ByStock.Title',
          width: 250,
          sortable: false
        },
        {
          key: 'Staffs',
          title: 'Nhân viên phụ trách',
          dataKey: 'Staffs',
          width: 250,
          sortable: false,
          cellRenderer: ({ rowData, container }) => (
            <EditableCell
              rowData={rowData}
              container={container}
              hideEditing={() => setIsEditing(false)}
              showEditing={() => setIsEditing(true)}
            />
          )
        },
        {
          key: 'TeleTags',
          title: 'Trạng thái',
          dataKey: 'TeleTags',
          width: 200,
          sortable: false
        },
        {
          key: 'TopTele',
          title: 'Liên hệ gần nhất',
          cellRenderer: ({ rowData }) => (
            <>
              {rowData.TopTele && rowData.TopTele.length > 0 ? (
                <div className="d-flex align-items-center w-100">
                  <Text className="flex-1 pr-10px" tooltipMaxWidth={280}>
                    {rowData.TopTele[0].Content}
                  </Text>
                  <OverlayTrigger
                    rootClose
                    trigger="click"
                    key="auto"
                    placement="auto"
                    overlay={
                      <Popover id={`popover-positioned-top`}>
                        <Popover.Body className="p-0 max-h-300px overflow-auto">
                          {rowData.TopTele.map((item, index) => (
                            <div
                              className={clsx(
                                'p-15px',
                                rowData.TopTele.length - 1 !== index &&
                                  'border-bottom'
                              )}
                              key={index}
                            >
                              {item.Content}
                              <div className="font-number mt-5px text-muted">
                                Ngày{' '}
                                {moment(item.CreateDate).format(
                                  'DD-MM-YYYY HH:mm'
                                )}
                              </div>
                            </div>
                          ))}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <i className="fa-solid fa-circle-info text-warning font-size-lg cursor-pointer"></i>
                  </OverlayTrigger>
                </div>
              ) : (
                <>Chưa có liên hệ</>
              )}
            </>
          ),
          dataKey: 'TopTele',
          width: 250,
          sortable: false
        },
        {
          key: 'TeleNote',
          title: 'Ghi chú',
          dataKey: 'TeleNote',
          width: 353,
          sortable: false
        },
        {
          key: 'action',
          title: 'Thao tác',
          dataKey: 'action',
          cellRenderer: ({ rowData }) => (
            <div className="d-flex">
              <a
                href={`tel:${rowData?.MobilePhone}`}
                className="w-38px h-38px rounded-circle btn btn-success shadow mx-4px p-0 position-relative"
              >
                <img
                  className="w-23px position-absolute top-7px right-7px"
                  src={AssetsHelpers.toAbsoluteUrl(
                    '/_assets/images/icon-call.png'
                  )}
                  alt=""
                />
              </a>
              <Link
                className="w-38px h-38px rounded-circle d-flex align-items-center justify-content-center text-none btn btn-primary shadow mx-4px"
                to={`${rowData.ID}/dich-vu`}
                state={{
                  from: pathname
                }}
              >
                <i className="fa-regular fa-arrow-right pt-2px"></i>
              </Link>
            </div>
          ),
          align: 'center',
          width: 130,
          sortable: false,
          frozen: width > 991 ? 'right' : false
        }
      ]
      if (columnsSort && columnsSort.length > 0) {
        newColumns = newColumns
          .map(clm => {
            let newClm = { ...clm }
            const indexSort = columnsSort.findIndex(x => x.key === clm.key)
            if (indexSort > -1) {
              newClm['order'] = columnsSort[indexSort]['order']
              newClm['isvisible'] = columnsSort[indexSort]['isvisible']
            }
            return newClm
          })
          .sort((a, b) => a.order - b.order)
          .filter(x => !x.isvisible)
      }
      return newColumns
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width]
  )

  const handleEndReached = () => {
    if (ListTelesales.length < PageTotal) {
      setFilters(prevState => ({ ...prevState, pi: prevState.pi + 1 }))
    }
  }

  const onFilter = values => {
    dispatch(setFiltersTeles(values))
    setFilters(prevState => ({ ...prevState, ...values, pi: 1 }))
  }

  // const onOpenModal = () => {
  //   setIsModal(true)
  // }

  const onHideModal = () => {
    setIsModal(false)
  }

  const ExportExcel = () => {
    setIsLoadingEx(true)
    checkGG(() => {
      let tele_user_id_new = ''
      if (filters.filter.emptyStaff) {
        tele_user_id_new = 0
      } else {
        tele_user_id_new = filters.filter.tele_user_id
          ? filters.filter.tele_user_id.value
          : ''
      }
      const newFilter = {
        ...filters,
        filter: {
          ...filters.filter,
          tele_user_id: tele_user_id_new,
          tele_process: filters.filter.tele_process
            ? filters.filter.tele_process.join(',')
            : '',
          wishlist: filters.filter.wishlist
            ? filters.filter.wishlist.map(wish => wish.value).join(',')
            : '',
          birthDateFrom: filters.filter.birthDateFrom
            ? moment(filters.filter.birthDateFrom).format('DD/MM')
            : '',
          birthDateTo: filters.filter.birthDateTo
            ? moment(filters.filter.birthDateTo).format('DD/MM')
            : '',
          bookDateFrom: filters.filter.bookDateFrom
            ? moment(filters.filter.bookDateFrom).format('DD/MM/YYYY')
            : '',
          bookDateTo: filters.filter.bookDateTo
            ? moment(filters.filter.bookDateTo).format('DD/MM/YYYY')
            : '',
          NotiFrom: filters.filter.NotiFrom
            ? moment(filters.filter.NotiFrom).format('DD/MM/YYYY')
            : '',
          NotiTo: filters.filter.NotiTo
            ? moment(filters.filter.NotiTo).format('DD/MM/YYYY')
            : '',
          CreateFrom: filters.filter.CreateFrom
            ? moment(filters.filter.CreateFrom).format('DD/MM/YYYY')
            : '',
          CreateTo: filters.filter.CreateTo
            ? moment(filters.filter.CreateTo).format('DD/MM/YYYY')
            : ''
        },
        pi: 1,
        ps: PageTotal
      }

      telesalesApi.getListMemberTelesales(newFilter).then(({ data }) => {
        window?.EzsExportExcel &&
          window?.EzsExportExcel({
            Url: 'telesale',
            Data: {
              data: data,
              params: filters
            },
            hideLoading: () => setIsLoadingEx(false)
          })
      })
    })
  }

  return (
    <div className="d-flex h-100 telesales-list">
      <Sidebar
        filters={filters}
        loading={loading}
        onSubmit={onFilter}
        onRefresh={onRefresh}
      />
      <div className="telesales-list__content flex-fill px-15px px-lg-30px pb-15px pb-lg-30px d-flex flex-column">
        <div className="border-bottom py-10px fw-600 font-size-lg position-relative d-flex justify-content-between align-items-center">
          <div className="flex-1">
            <span className="text-uppercase ">Danh sách khách hàng -</span>
            <span className="text-danger pl-3px">{PageTotal}</span>
            <span className="pl-5px font-label text-muted font-size-sm text-none">
              khách hàng
            </span>
          </div>
          <div className="w-85px w-md-auto d-flex">
            <Navbar ExportExcel={ExportExcel} IsLoadingEx={IsLoadingEx} />
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenModal}
            >
              <i className="far fa-bells pr-5px"></i>
              <span className="d-none d-md-inline-block">Lịch nhắc</span>
            </button> */}
            <button
              type="button"
              className="btn btn-primary d-lg-none ml-5px"
              onClick={onOpenSidebar}
            >
              <i className="fa-solid fa-filters"></i>
            </button>
          </div>
        </div>
        <div className="flex-grow-1">
          <ReactBaseTableInfinite
            rowKey="ID"
            columns={columns}
            data={ListTelesales}
            loading={loading}
            pageCount={PageCount}
            onEndReachedThreshold={300}
            onEndReached={handleEndReached}
            rowHeight={60}
            onScroll={() => IsEditing && document.body.click()}
            //onPagesChange={onPagesChange}
            //rowRenderer={rowRenderer}
          />
        </div>
      </div>
      <ReminderCalendar show={isModal} onHide={onHideModal} filters={filters} />
    </div>
  )
}

export default TelesalesList
