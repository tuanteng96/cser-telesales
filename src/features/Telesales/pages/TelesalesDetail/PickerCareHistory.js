import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Overlay, Popover } from 'react-bootstrap'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import telesalesApi from 'src/api/telesales.api'
import SelectTeleHis from 'src/components/Selects/SelectTeleHis'

const initialValues = { Content: '', Result: null, IsPublic: false }
const validationSchema = Yup.object({
  Content: Yup.string().trim().required('Nhập ghi chú')
})

function PickerCareHistory({ children, memberId, onSaved, onEditingChange }) {
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const target = useRef(null)

  useEffect(() => () => onEditingChange?.(false), [onEditingChange])

  const onHide = () => {
    if (saving) return
    setVisible(false)
    onEditingChange?.(false)
  }

  const onSubmit = async (values, { setStatus }) => {
    setSaving(true)
    setStatus(null)
    try {
      if (values.IsPublic) {
        const body = new FormData()
        body.append(
          'data',
          JSON.stringify({
            ID: 0,
            Target: '',
            MemberID: memberId,
            Content: encodeURI(
              [values.Result?.value, values.Content].filter(Boolean).join('. ')
            ),
            IsNoti: false,
            NotiDate: '',
            IsEd: 0,
            IsPublic: 0,
            IsImportant: false
          })
        )
        const { data } = await telesalesApi.addNoteMember(body)
        if (data?.error) throw new Error('Không thể lưu ghi chú')
      }
      const { data } = await telesalesApi.addCareHistory({
        items: [
          {
            MemberID: memberId,
            Content: values.Content,
            Type: 'PROCESS',
            Result: values.Result?.value || ''
          }
        ],
        delete: []
      })
      if (data?.error) throw new Error('Không thể lưu lịch sử')
      setVisible(false)
      onEditingChange?.(false)
      onSaved()
      window.top?.toastr?.success('Thêm mới lịch sử thành công', '', {
        timeOut: 1500
      })
    } catch (error) {
      setStatus('Không thể lưu lịch sử chăm sóc. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <span ref={target} className="d-inline-flex">
        {children({
          open: () => {
            setVisible(true)
            onEditingChange?.(true)
          }
        })}
      </span>
      <Overlay
        target={target.current}
        show={visible}
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
          id={`care-history-add-${memberId}`}
          style={{
            width: 380,
            minWidth: 0,
            maxWidth: 'calc(100vw - 24px)',
            zIndex: 1060
          }}
        >
          {visible && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                touched,
                errors,
                setFieldValue,
                handleChange,
                handleBlur,
                status
              }) => (
                <Form>
                  <Popover.Header>Thêm mới lịch sử chăm sóc</Popover.Header>
                  <Popover.Body>
                    <fieldset disabled={saving} className="tw-min-w-0">
                      <div className="form-group mb-15px">
                        <label htmlFor={`care-result-${memberId}`}>
                          Kết quả
                        </label>
                        <SelectTeleHis
                          inputId={`care-result-${memberId}`}
                          placeholder="Chọn kết quả"
                          value={values.Result}
                          onChange={value => setFieldValue('Result', value)}
                          isDisabled={saving}
                        />
                      </div>
                      <div className="form-group mb-15px">
                        <label htmlFor={`care-content-${memberId}`}>
                          Ghi chú
                        </label>
                        <textarea
                          id={`care-content-${memberId}`}
                          name="Content"
                          className={`form-control ${
                            touched.Content && errors.Content
                              ? 'is-invalid'
                              : ''
                          }`}
                          rows="5"
                          value={values.Content}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={Boolean(
                            touched.Content && errors.Content
                          )}
                          aria-describedby={
                            touched.Content && errors.Content
                              ? `care-content-error-${memberId}`
                              : undefined
                          }
                        />
                        {touched.Content && errors.Content && (
                          <div
                            id={`care-content-error-${memberId}`}
                            className="invalid-feedback"
                          >
                            {errors.Content}
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer checkbox d-flex">
                        <input
                          type="checkbox"
                          name="IsPublic"
                          checked={values.IsPublic}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="checkbox-icon"></span>
                        <span>Cho phép lễ tân xem</span>
                      </label>
                    </fieldset>
                    {status && (
                      <div role="alert" className="text-danger mt-10px">
                        {status}
                      </div>
                    )}
                  </Popover.Body>
                  <div className="border-top d-flex justify-content-end tw-gap-2 p-10px">
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      disabled={saving}
                      onClick={onHide}
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm"
                      disabled={saving}
                    >
                      {saving ? 'Đang lưu...' : 'Thêm mới'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Popover>
      </Overlay>
    </>
  )
}

PickerCareHistory.propTypes = {
  children: PropTypes.func.isRequired,
  memberId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onSaved: PropTypes.func.isRequired,
  onEditingChange: PropTypes.func
}

export default PickerCareHistory
