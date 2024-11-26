import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import ReactBaseTableInfinite from 'src/components/Tables/ReactBaseTableInfinite'
import Text from 'react-texty'

import moment from 'moment'
import 'moment/locale/vi'
import { useState } from 'react'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'

moment.locale('vi')

ModalOptionService.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool
}

function ModalOptionService({ onHide, show, OsItems }) {
  const [Items, setItems] = useState(null)
  useEffect(() => {
    if (show) {
      if (OsItems.OsItems && OsItems.OsItems.length > 0) {
        let newItems = []
        for (let item of OsItems.OsItems) {
          let obj = {
            ...item,
            LUU_Y: '',
            DANH_GIA: '',
            THU_THUAT: '',
            TINH_TRANG: ''
          }
          if (item.InfoJSON) {
            let InfoJSONP = JSON.parse(item.InfoJSON)
            obj = {
              ...obj,
              ...InfoJSONP
            }
          }
          newItems.push(obj)
        }
        setItems(newItems)
      } else {
        setItems([])
      }
    } else {
      setItems(null)
    }
  }, [OsItems, show])
  const columns = useMemo(
    () => [
      {
        key: 'BookDate',
        title: 'Ngày sử dụng',
        cellRenderer: ({ rowData }) =>
          moment(rowData.BookDate).format('HH:mm DD-MM-YYYY'),
        dataKey: 'BookDate',
        width: 180,
        sortable: false
      },
      {
        key: 'IsWarrant',
        title: 'Loại buổi',
        cellRenderer: ({ rowData }) =>
          rowData.IsWarrant ? 'Bảo hành' : 'Buổi thường',
        dataKey: 'IsWarrant',
        width: 180,
        sortable: false
      },
      {
        key: 'Staffs',
        title: 'Nhân viên thực hiện',
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={280}>
            {rowData.Staffs && rowData.Staffs.length > 0
              ? rowData.Staffs.map(item => item.FullName).join(', ')
              : 'Không xác định'}
          </Text>
        ),
        dataKey: 'Staffs',
        className: 'flex-fill',
        width: 250,
        sortable: false
      },
      {
        key: 'Desc',
        title: 'Ghi chú',
        dataKey: 'Desc',
        width: 200,
        sortable: false
      },
      {
        key: 'LUU_Y',
        title: 'Lưu ý',
        dataKey: 'LUU_Y',
        width: 200,
        sortable: false,
        hidden: !window?.top?.GlobalConfig?.Admin?.os_4_chi_tiet
      },
      {
        key: 'DANH_GIA',
        title: 'Đánh giá',
        dataKey: 'DANH_GIA',
        width: 200,
        sortable: false,
        hidden: !window?.top?.GlobalConfig?.Admin?.os_4_chi_tiet
      },
      {
        key: 'THU_THUAT',
        title: 'Thủ thuật',
        dataKey: 'THU_THUAT',
        width: 200,
        sortable: false,
        hidden: !window?.top?.GlobalConfig?.Admin?.os_4_chi_tiet
      },
      {
        key: 'TINH_TRANG',
        title: 'Tình trạng',
        dataKey: 'TINH_TRANG',
        width: 200,
        sortable: false,
        hidden: !window?.top?.GlobalConfig?.Admin?.os_4_chi_tiet
      },
      {
        key: 'Rate',
        title: 'Đánh giá',
        dataKey: 'Rate',
        cellRenderer: ({ rowData }) => (
          <div>
            {rowData.Rate > 0 ? (
              <>
                <span
                  className="pr-5px"
                  style={{
                    fontWeight: '600'
                  }}
                >
                  {rowData.Rate}
                </span>
                <i class="fas fa-star text-warning"></i>
              </>
            ) : (
              <></>
            )}
          </div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: 'RateNote',
        title: 'Ghi chú đánh giá',
        dataKey: 'RateNote',
        width: 200,
        sortable: false
      },
      {
        key: 'Attachs',
        title: 'Hình ảnh',
        dataKey: 'Attachs',
        cellRenderer: ({ rowData }) => (
          <div
            className="w-100 py-12px"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
              gap: '8px'
            }}
          >
            {rowData.Attachs && rowData.Attachs.length > 0 ? (
              rowData.Attachs.map((x, i) => (
                <a
                  className="block"
                  href={AssetsHelpers.toUrlServer('/upload/image/' + x.Src)}
                  key={i}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="w-100"
                    src={AssetsHelpers.toUrlServer('/upload/image/' + x.Src)}
                    alt=""
                  />
                </a>
              ))
            ) : (
              <></>
            )}
          </div>
        ),
        width: 300,
        sortable: false
      }
    ],
    []
  )
  if (!Items) return ''

  return (
    <Modal show={show} dialogClassName="modal-xl" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="font-size-lg text-uppercase">
          Lịch sử {OsItems.ProdTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="h-500px">
          <ReactBaseTableInfinite
            rowKey="ID"
            columns={columns}
            data={Items || []}
            loading={false}
            pageCount={1}
            estimatedRowHeight={80}
            //rowHeight={50}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={onHide}>
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalOptionService
