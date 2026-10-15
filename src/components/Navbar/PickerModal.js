import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { useQueryClient } from '@tanstack/react-query'
import { Field, FieldArray, Form, Formik } from 'formik'
import configApi from 'src/api/config.api'
import useTagKh, { TAG_KH_QUERY_KEY } from 'src/hooks/useTagKh'

const deleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="tw-w-5 tw-h-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
)

function PickerModal({ children }) {
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient()

  const { data: groups, isFetching, isError } = useTagKh({ enabled: visible })

  const onSubmit = async ({ groups: values }, { setSubmitting, setStatus }) => {
    setStatus(null)
    try {
      await configApi.saveConfigName({ Name: 'tagkh', body: values })
      queryClient.setQueryData(TAG_KH_QUERY_KEY, values)
      setVisible(false)
      await queryClient.invalidateQueries({ queryKey: TAG_KH_QUERY_KEY })
      window.top?.toastr &&
        window.top?.toastr.success('Lưu thay đổi thành công', '', {
          timeOut: 1500
        })
    } catch (error) {
      setStatus('Không thể lưu thay đổi. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {children({
        open: () => {
          setVisible(true)
        }
      })}
      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        aria-labelledby="picker-modal-title"
        size="md"
        scrollable
        centered
      >
        <Modal.Header closeButton closeLabel="Đóng">
          <div>
            <Modal.Title id="picker-modal-title">
              Cài đặt phân loại khác
            </Modal.Title>
            <p className="tw-mb-0 tw-mt-1 tw-text-sm tw-text-gray-500">
              Quản lý nhóm phân loại và các mục bên trong.
            </p>
          </div>
        </Modal.Header>
        {isFetching || isError ? (
          <Modal.Body>
            {isFetching && <div role="status">Đang tải dữ liệu...</div>}
            {isError && (
              <div role="alert" className="text-danger">
                Không thể tải cấu hình phân loại khác.
              </div>
            )}
          </Modal.Body>
        ) : (
          visible && (
            <Formik
              initialValues={{ groups: groups || [] }}
              onSubmit={onSubmit}
            >
              {({ values, isSubmitting, status }) => (
                <Form className="overflow-hidden d-flex flex-column tw-min-h-0 tw-flex-1">
                  <Modal.Body className="tw-bg-gray-50 tw-p-4 sm:tw-p-6">
                    <fieldset disabled={isSubmitting} className="tw-min-w-0">
                      <FieldArray name="groups">
                        {({ push, remove }) => (
                          <>
                            {values.groups.length === 0 && (
                              <div className="tw-rounded-lg tw-border tw-border-dashed tw-border-gray-300 tw-bg-white tw-p-8 tw-text-center tw-mb-4">
                                <p className="tw-font-semibold tw-mb-1">
                                  Chưa có nhóm phân loại
                                </p>
                                <p className="tw-text-gray-500 tw-mb-0">
                                  Thêm nhóm đầu tiên để bắt đầu tạo các mục.
                                </p>
                              </div>
                            )}
                            {values.groups.map((group, groupIndex) => (
                              <section
                                key={groupIndex}
                                aria-labelledby={`tagkh-heading-${groupIndex}`}
                                className="tw-min-w-0 tw-rounded-lg tw-border tw-border-solid tw-border-gray-200 tw-bg-white tw-mb-4 tw-overflow-hidden tw-shadow-sm"
                              >
                                <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-bg-gray-50 tw-border-0 tw-border-b tw-border-solid tw-border-gray-200 tw-px-4 tw-py-2">
                                  <div className="tw-flex tw-items-center tw-gap-2">
                                    <h3
                                      id={`tagkh-heading-${groupIndex}`}
                                      className="tw-m-0 tw-text-sm tw-font-semibold tw-text-gray-800"
                                    >
                                      Nhóm{' '}
                                      {String(groupIndex + 1).padStart(2, '0')}
                                    </h3>
                                    <span className="tw-rounded-full tw-bg-white tw-border tw-border-solid tw-border-gray-200 tw-px-2 tw-py-0.5 tw-text-xs tw-text-gray-500">
                                      {group.Children.length} mục
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="flex-shrink-0 btn tw-inline-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-p-0 tw-text-gray-500 hover:tw-text-red-600 hover:tw-bg-red-50 focus-visible:tw-ring-2 focus-visible:tw-ring-red-400"
                                    onClick={() => remove(groupIndex)}
                                    aria-label={`Xoá nhóm ${
                                      group.Title || groupIndex + 1
                                    }`}
                                    title="Xoá nhóm"
                                  >
                                    {deleteIcon}
                                  </button>
                                </div>
                                <div className="tw-p-4 sm:tw-p-5">
                                  <div className="tw-min-w-0 tw-mb-5">
                                    <label
                                      className="tw-font-semibold"
                                      htmlFor={`tagkh-group-${groupIndex}`}
                                    >
                                      Tên nhóm
                                    </label>
                                    <Field
                                      id={`tagkh-group-${groupIndex}`}
                                      name={`groups.${groupIndex}.Title`}
                                      className="form-control tw-font-semibold"
                                      placeholder="Nhập tên nhóm"
                                      required
                                      pattern=".*\S.*"
                                    />
                                  </div>
                                  <div>
                                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
                                      <h3 className="tw-text-sm tw-font-semibold tw-m-0">
                                        Các mục trong nhóm
                                      </h3>
                                    </div>
                                    <FieldArray
                                      name={`groups.${groupIndex}.Children`}
                                    >
                                      {({
                                        push: addChild,
                                        remove: removeChild
                                      }) => (
                                        <>
                                          {group.Children.length === 0 && (
                                            <p className="tw-text-gray-500 tw-text-sm tw-rounded tw-bg-gray-50 tw-p-3">
                                              Nhóm này chưa có mục nào.
                                            </p>
                                          )}
                                          {group.Children.map(
                                            (child, childIndex) => (
                                              <div
                                                key={childIndex}
                                                className="tw-flex tw-items-center tw-gap-2 tw-mb-2"
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className="tw-w-5 tw-flex-shrink-0 tw-text-center tw-text-xs tw-text-gray-400"
                                                >
                                                  {childIndex + 1}
                                                </span>
                                                <div className="flex-fill tw-min-w-0">
                                                  <Field
                                                    id={`tagkh-child-${groupIndex}-${childIndex}`}
                                                    aria-label={`Tên mục ${
                                                      childIndex + 1
                                                    } trong nhóm ${
                                                      group.Title ||
                                                      groupIndex + 1
                                                    }`}
                                                    name={`groups.${groupIndex}.Children.${childIndex}.Title`}
                                                    className="form-control"
                                                    placeholder="Nhập tên mục"
                                                    required
                                                    pattern=".*\S.*"
                                                  />
                                                </div>
                                                <button
                                                  type="button"
                                                  className="flex-shrink-0 btn tw-inline-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-p-0 tw-text-gray-500 hover:tw-text-red-600 hover:tw-bg-red-50 focus-visible:tw-ring-2 focus-visible:tw-ring-red-400"
                                                  title="Xoá mục"
                                                  onClick={() =>
                                                    removeChild(childIndex)
                                                  }
                                                  aria-label={`Xoá mục ${
                                                    child.Title ||
                                                    childIndex + 1
                                                  } trong nhóm ${
                                                    group.Title ||
                                                    groupIndex + 1
                                                  }`}
                                                >
                                                  {deleteIcon}
                                                </button>
                                              </div>
                                            )
                                          )}
                                          <button
                                            type="button"
                                            className="btn btn-light-primary tw-mt-2 tw-ml-7 tw-text-sm"
                                            onClick={() =>
                                              addChild({ Title: '' })
                                            }
                                          >
                                            <span
                                              aria-hidden="true"
                                              className="tw-mr-1"
                                            >
                                              +
                                            </span>
                                            Thêm mục vào nhóm
                                          </button>
                                        </>
                                      )}
                                    </FieldArray>
                                  </div>
                                </div>
                              </section>
                            ))}
                            <button
                              type="button"
                              className="btn tw-w-full tw-min-h-11 tw-border tw-border-dashed tw-border-gray-300 tw-bg-white tw-text-gray-600 hover:tw-border-blue-400 hover:tw-bg-blue-50 hover:tw-text-blue-700"
                              onClick={() => push({ Title: '', Children: [] })}
                            >
                              <span aria-hidden="true" className="tw-mr-1">
                                +
                              </span>
                              Thêm nhóm mới
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </fieldset>
                    {status && (
                      <div role="alert" className="text-danger tw-mt-3">
                        {status}
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer className="tw-flex-shrink-0 tw-bg-white">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setVisible(false)}
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          )
        )}
      </Modal>
    </>
  )
}

PickerModal.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.any,
  initialValues: PropTypes.object
}

export default PickerModal
