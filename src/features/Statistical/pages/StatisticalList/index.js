import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import telesalesApi from 'src/api/telesales.api'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Sidebar from './components/Sidebar'
import { StatisticalContext } from '../..'
import PageHeader from 'src/components/Navbar/PageHeader'

import moment from 'moment'
import 'moment/locale/vi'
import { Link, useLocation } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'

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

function StatisticalList(props) {
  const { CrStockID, teleAdv, User } = useSelector(({ auth }) => ({
    CrStockID: auth?.Info?.CrStockID || '',
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false,
    User: auth?.Info?.User
  }))
  const [ListTelesales, setListTelesales] = useState([])
  const [loading, setLoading] = useState(false)
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)
  const [IsLoadingEx, setIsLoadingEx] = useState(false)

  const { pathname, state } = useLocation()

  const [filters, setFilters] = useState(
    state?.filters
      ? state?.filters
      : {
          filter: {
            UserID: !teleAdv
              ? {
                  label: User.FullName,
                  value: User.ID
                }
              : '',
            From: '',
            To: '',
            StockID: CrStockID,
            Result: '',
            tele_process: '',
            GroupsID: ''
          },
          pi: 1,
          ps: 20
        }
  )

  const { width } = useWindowSize()

  const { onOpenSidebar } = useContext(StatisticalContext)

  useEffect(() => {
    getListStatistical()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListStatistical = callback => {
    setLoading(true)
    const newFilter = {
      ...filters,
      filter: {
        ...filters.filter,
        From: filters.filter.From
          ? moment(filters.filter.From).format('DD/MM/YYYY')
          : '',
        To: filters.filter.To
          ? moment(filters.filter.To).format('DD/MM/YYYY')
          : '',
        Result: filters.filter.Result ? filters.filter.Result.value : '',
        UserID: filters.filter.UserID ? filters.filter.UserID.value : '',
        GroupsID: filters?.filter?.GroupsID?.value || '',
        tele_process: filters.filter.tele_process
          ? filters.filter.tele_process.join(',')
          : ''
      },
      pi: callback ? 1 : filters.pi
    }

    telesalesApi
      .getListStatisticals(newFilter)
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
    getListStatistical(() => {
      callback && callback()
    })
  }

  const columns = useMemo(
    () => {
      return [
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
          key: 'MemberName',
          title: 'Họ tên khách hàng',
          dataKey: 'MemberName',
          cellRenderer: ({ rowData }) => (
            <div>
              <div className="fw-600">{rowData?.MemberName}</div>
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
            <div>{moment(rowData?.CreateDate).format('HH:mm DD-MM-YYYY')}</div>
          ),
          width: 180,
          sortable: false
        },
        {
          key: 'StockTitle',
          title: 'Cơ sở',
          dataKey: 'StockTitle',
          width: 250,
          sortable: false
        },
        {
          key: 'Content',
          title: 'Nội dung',
          dataKey: 'Content',
          width: 350,
          sortable: false
        },
        {
          key: 'Result',
          title: 'Kết quả',
          dataKey: 'Result',
          width: 350,
          sortable: false
        },
        {
          key: 'TeleName',
          title: 'Nhân viên thực hiện',
          dataKey: 'TeleName',
          width: 250,
          sortable: false
        },
        {
          key: 'action',
          title: 'Thao tác',
          dataKey: 'action',
          cellRenderer: ({ rowData }) => (
            <div className="d-flex">
              <Link
                className="shadow w-38px h-38px rounded-circle d-flex align-items-center justify-content-center text-none btn btn-primary mx-4px"
                to={`/danh-sach/${rowData.MemberID}/dich-vu`}
                state={{ from: pathname, filters: filters }}
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, pathname, filters]
  )

  const handleEndReached = () => {
    if (ListTelesales.length < PageTotal) {
      setFilters(prevState => ({ ...prevState, pi: prevState.pi + 1 }))
    }
  }

  const onFilter = values => {
    setFilters(prevState => ({ ...prevState, ...values, pi: 1 }))
  }

  const ExportExcel = () => {
    setIsLoadingEx(true)
    checkGG(() => {
      const newFilter = {
        ...filters,
        filter: {
          ...filters.filter,
          From: filters.filter.From
            ? moment(filters.filter.From).format('DD/MM/YYYY')
            : '',
          To: filters.filter.To
            ? moment(filters.filter.To).format('DD/MM/YYYY')
            : '',
          Result: filters.filter.Result ? filters.filter.Result.value : '',
          UserID: filters.filter.UserID ? filters.filter.UserID.value : ''
        },
        pi: 1,
        ps: PageTotal
      }

      telesalesApi.getListStatisticals(newFilter).then(({ data }) => {
        window?.EzsExportExcel &&
          window?.EzsExportExcel({
            Url: 'telesale-statistical',
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
      <div className="telesales-list__content flex-fill px-15px px-lg-20px pb-15px pb-lg-20px d-flex flex-column">
        <PageHeader
          title="Thống kê chăm sóc khách hàng"
          total={PageTotal}
          onExport={ExportExcel}
          isExporting={IsLoadingEx}
          onOpenSidebar={onOpenSidebar}
          onRefresh={onRefresh}
        />
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
            //onPagesChange={onPagesChange}
            //rowRenderer={rowRenderer}
          />
        </div>
      </div>
    </div>
  )
}

export default StatisticalList
