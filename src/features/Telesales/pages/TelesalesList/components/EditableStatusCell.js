import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Overlay, Popover } from 'react-bootstrap'
import telesalesApi from 'src/api/telesales.api'
import SelectProgress from 'src/components/Selects/SelectProgress'

function EditableStatusCell({ rowData, onSaved, onEditingChange }) {
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const target = useRef(null)

  useEffect(() => () => onEditingChange(false), [onEditingChange])

  const onHide = () => {
    setEditing(false)
    onEditingChange(false)
  }

  useEffect(() => {
    setValues(
      rowData.TeleTags
        ? rowData.TeleTags.split(',').map(value => ({ label: value, value }))
        : []
    )
    setError('')
  }, [rowData.ID, rowData.TeleTags])

  const onSubmit = async options => {
    setLoading(true)
    setError('')
    const nextValues = options || []
    try {
      const { data } = await telesalesApi.editTagsMember({
        items: [
          {
            MemberID: rowData.ID,
            TeleTags: nextValues.map(item => item.value).join(',')
          }
        ]
      })
      if (data?.error) throw new Error('Không thể lưu trạng thái')
      setValues(nextValues)
      onSaved()
    } catch (error) {
      setError('Không thể lưu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        ref={target}
        type="button"
        className="btn p-0 h-100 w-100 text-start text-reset d-flex align-items-center"
        aria-label={`Sửa trạng thái của ${rowData.FullName || rowData.ID}`}
        aria-expanded={editing}
        onClick={() => {
          setEditing(true)
          onEditingChange(true)
        }}
      >
        <span className="tw-line-clamp-2 tw-break-words">
          {values.length
            ? values.map(item => item.label).join(', ')
            : 'Chọn trạng thái'}
        </span>
      </button>
      <Overlay
        target={target.current}
        show={editing}
        placement="auto-start"
        flip
        popperConfig={{
          modifiers: [
            {
              name: 'flip',
              options: {
                allowedAutoPlacements: ['top-start', 'bottom-start'],
                padding: 8
              }
            },
            { name: 'preventOverflow', options: { padding: 8 } }
          ]
        }}
        onHide={onHide}
        rootClose
      >
        <Popover
          id={`telesales-status-popover-${rowData.ID}`}
          style={{
            width: 300,
            maxWidth: 'calc(100vw - 24px)',
            zIndex: 1060
          }}
        >
          <Popover.Header>Trạng thái khách hàng</Popover.Header>
          <Popover.Body>
            <SelectProgress
              autoFocus
              isMulti
              isClearable
              defaultMenuIsOpen
              closeMenuOnSelect={false}
              isDisabled={loading}
              isLoading={loading}
              inputId={`telesales-status-${rowData.ID}`}
              aria-label={`Trạng thái của ${rowData.FullName || rowData.ID}`}
              placeholder="Chọn trạng thái"
              value={values}
              onChange={onSubmit}
              styles={{
                valueContainer: base => ({
                  ...base,
                  maxHeight: 120,
                  overflowY: 'auto'
                }),
                menu: base => ({
                  ...base,
                  position: 'static',
                  boxShadow: 'none',
                  marginBottom: 0
                }),
                menuList: base => ({ ...base, maxHeight: 240 })
              }}
            />
            {error && (
              <div role="alert" className="text-danger font-size-sm mt-5px">
                {error}
              </div>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

EditableStatusCell.propTypes = {
  rowData: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onEditingChange: PropTypes.func.isRequired
}

export default EditableStatusCell
