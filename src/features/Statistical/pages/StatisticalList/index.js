import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import telesalesApi from 'src/api/telesales.api'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Sidebar from './components/Sidebar'
import { StatisticalContext } from '../..'
import Navbar from 'src/components/Navbar/Navbar'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

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

  const [filters, setFilters] = useState({
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
      Result: ''
    },
    pi: 1,
    ps: 20
  })

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
        UserID: filters.filter.UserID ? filters.filter.UserID.value : ''
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
    () => [
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
        width: 250,
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
      }
    ],
    []
  )

  const handleEndReached = () => {
    if (ListTelesales.length < PageTotal) {
      setFilters(prevState => ({ ...prevState, pi: prevState.pi + 1 }))
    }
  }

  const onFilter = values => {
    setFilters(prevState => ({ ...prevState, ...values, pi: 1 }))
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
            <span className="text-uppercase">
              Thống kê chăm sóc khách hàng -
            </span>
            <span className="text-danger pl-3px">{PageTotal}</span>
            <span className="pl-5px font-label text-muted font-size-sm text-none">
              lượt chăm sóc
            </span>
          </div>
          <div className="w-85px w-md-auto d-flex">
            <Navbar />
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
            //onPagesChange={onPagesChange}
            //rowRenderer={rowRenderer}
          />
        </div>
      </div>
    </div>
  )
}

export default StatisticalList
