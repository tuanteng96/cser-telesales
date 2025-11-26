import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import uuid from 'react-uuid'

import moment from 'moment'
import 'moment/locale/vi'
import { Dropdown } from 'react-bootstrap'

moment.locale('vi')

function TelesalesOptionBuying(props) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [ListData, setListData] = useState([])
  const [filters, setFilters] = useState({
    ProdOrService: '',
    MemberID: MemberID,
    pi: 1,
    ps: 20
  })
  const [PageCount, setPageCount] = useState(0)
  const [PageTotal, setPageTotal] = useState(0)

  useEffect(() => {
    getListBuyingProducs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const getListBuyingProducs = () => {
    setLoading(true)
    telesalesApi
      .getListBuydingProduct(filters)
      .then(({ data }) => {
        if (data.error) {
          // Xử lí lỗi
        } else {
          const { List, PCount, Total } = {
            List: data?.items || [],
            PCount: data?.pcount || 0,
            Total: data?.total || 0
          }
          const newList = List.map(item => ({ ...item, Ids: uuid() }))
          if (filters.pi > 1) {
            setListData(prevState => [...prevState, ...newList])
          } else {
            setListData(newList)
          }

          setPageCount(PCount)
          setPageTotal(Total)
          setLoading(false)
        }
      })
      .catch(error => console.log(error))
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
        key: 'CreateDate',
        title: 'Ngày mua hàng',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        width: 200,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên mặt hàng',
        dataKey: 'Title',
        width: 350,
        sortable: false,
        className: 'flex-fill',
        headerClassName: 'flex-fill',
        headerRenderer: ({ column }) => {
          return (
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div className="text-uppercase">{column.title}</div>
              <div>
                <select
                  style={{
                    border: '1px solid #eaeaeb',
                    padding: '4px 7px',
                    borderRadius: '3px',
                    outline: 'none'
                  }}
                  onChange={e => {
                    setFilters(prevState => ({
                      ...prevState,
                      ProdOrService: e.target.value
                    }))
                  }}
                >
                  <option value="">Tất cả</option>
                  <option value="0">Sản phẩm</option>
                  <option value="1">Dịch vụ</option>
                  <option value="2">Phụ phí</option>
                  <option value="3">Nguyên vật liệu</option>
                  <option value="4">Thẻ tiền</option>
                </select>
              </div>
            </div>
          )
        }
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        dataKey: 'Qty',
        width: 100,
        sortable: false,
        align: 'center'
      }
    ],
    []
  )

  const handleEndReached = () => {
    if (ListData.length < PageTotal) {
      setFilters(prevState => ({ ...prevState, pi: prevState.pi + 1 }))
    }
  }

  return (
    <div className="h-100 p-20px">
      <ReactBaseTableInfinite
        rowKey="Ids"
        columns={columns}
        data={ListData}
        loading={loading}
        pageCount={PageCount}
        onEndReachedThreshold={300}
        onEndReached={handleEndReached}
        rowHeight={50}
      />
    </div>
  )
}

export default TelesalesOptionBuying
