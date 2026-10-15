import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import telesalesApi from 'src/api/telesales.api'
import { useOutletContext, useParams } from 'react-router-dom'

NoteMember.propTypes = {
  initialValues: PropTypes.string,
  loading: PropTypes.bool,
  memberId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSaved: PropTypes.func,
  onChange: PropTypes.func,
  autoSave: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string
}

function NoteMember({
  initialValues,
  loading,
  memberId,
  onSaved,
  onChange,
  autoSave = true,
  autoFocus = false,
  className = 'pl-15px pr-15px pb-15px pt-8px'
}) {
  const params = useParams()
  const MemberID = memberId ?? params.MemberID
  const outletContext = useOutletContext()
  const [values, setValues] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValues(initialValues || '')
  }, [initialValues, MemberID])

  const onSubmit = e => {
    const value = e.target.value
    setValues(value)
    setError('')
    onChange?.(value)
    if (!autoSave) return
    const newData = {
      items: [
        {
          MemberID: MemberID,
          Note: value
        }
      ]
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSaving(true)
      telesalesApi
        .editNoteMember(newData)
        .then(({ data }) => {
          if (data?.error) throw new Error('Không thể lưu ghi chú')
          if (onSaved) {
            onSaved(value)
          } else {
            outletContext?.onRefresh()
          }
        })
        .catch(() => setError('Không thể lưu ghi chú. Vui lòng thử lại.'))
        .finally(() => setSaving(false))
    }, 300)
  }
  return (
    <div className={className}>
      <div className="overlay overlay-block">
        <textarea
          className="w-100 form-control form-control-solid p-12px fw-500"
          rows="6"
          placeholder="Nhập ghi chú"
          aria-label="Ghi chú khách hàng"
          autoFocus={autoFocus}
          disabled={loading || saving}
          onChange={onSubmit}
          value={values}
        ></textarea>
        {loading && (
          <div className="overlay-layer bg-dark-o-10">
            <div className="spinner spinner-primary"></div>
          </div>
        )}
      </div>
      {saving && (
        <div role="status" className="text-muted font-size-sm mt-5px">
          Đang lưu...
        </div>
      )}
      {error && (
        <div role="alert" className="text-danger font-size-sm mt-5px">
          {error}
        </div>
      )}
    </div>
  )
}

export default NoteMember
