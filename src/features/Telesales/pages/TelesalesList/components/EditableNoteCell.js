import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Overlay, Popover } from 'react-bootstrap'
import NoteMember from '../../TelesalesDetail/NoteMember'
import telesalesApi from 'src/api/telesales.api'

function EditableNoteCell({ rowData, onSaved, onEditingChange }) {
  const [note, setNote] = useState(rowData.TeleNote || '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const target = useRef(null)

  useEffect(() => () => onEditingChange(false), [onEditingChange])
  useEffect(
    () => setNote(rowData.TeleNote || ''),
    [rowData.ID, rowData.TeleNote]
  )

  const close = () => {
    setEditing(false)
    onEditingChange(false)
  }

  const onHide = async () => {
    if (saving) return
    if (draft === note) {
      close()
      return
    }
    setSaving(true)
    setError('')
    try {
      const { data } = await telesalesApi.editNoteMember({
        items: [{ MemberID: rowData.ID, Note: draft }]
      })
      if (data?.error) throw new Error('Không thể lưu ghi chú')
      setNote(draft)
      close()
      onSaved()
    } catch (error) {
      setError('Không thể lưu ghi chú. Vui lòng đóng lại để thử lưu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        ref={target}
        type="button"
        className="btn p-0 h-100 w-100 text-start text-reset d-flex align-items-center"
        aria-label={`Sửa ghi chú của ${rowData.FullName || rowData.ID}`}
        aria-expanded={editing}
        onClick={() => {
          if (editing) return
          setDraft(note)
          setError('')
          setEditing(true)
          onEditingChange(true)
        }}
      >
        <span className="tw-line-clamp-2 tw-break-words tw-whitespace-pre-line">
          {note || 'Thêm ghi chú'}
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
          id={`telesales-note-popover-${rowData.ID}`}
          style={{ width: 360, maxWidth: 'calc(100vw - 24px)', zIndex: 1060 }}
        >
          <Popover.Header>Ghi chú khách hàng</Popover.Header>
          <Popover.Body>
            <NoteMember
              memberId={rowData.ID}
              initialValues={draft}
              autoSave={false}
              onChange={setDraft}
              loading={saving}
              autoFocus
              className="p-0"
            />
            {error && (
              <div role="alert" className="text-danger font-size-sm mt-5px">
                {error}
              </div>
            )}
            <div className="d-flex align-items-center justify-content-between mt-10px">
              {saving && (
                <span role="status" className="text-muted font-size-sm">
                  Đang lưu...
                </span>
              )}
              <button
                type="button"
                className="btn btn-sm btn-primary tw-ml-auto"
                disabled={saving}
                onClick={onHide}
              >
                Đóng
              </button>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}

EditableNoteCell.propTypes = {
  rowData: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onEditingChange: PropTypes.func.isRequired
}

export default EditableNoteCell
