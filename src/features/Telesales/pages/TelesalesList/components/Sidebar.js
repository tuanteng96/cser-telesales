import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import configApi from 'src/api/config.api'
import SelectProductService from 'src/components/Selects/SelectProductService'
import DatePicker, { registerLocale } from 'react-datepicker'
import SelectStaffs from 'src/components/Selects/SelectStaffs'
import { NumericFormat } from 'react-number-format'
import clsx from 'clsx'
import Skeleton from 'react-loading-skeleton'
import MemberTransfer from './MemberTransfer'
import telesalesApi from 'src/api/telesales.api'
import { useSelector } from 'react-redux'
import { TelesalesContext } from 'src/features/Telesales'
import SelectStocks from 'src/components/Selects/SelectStocks'

import vi from 'date-fns/locale/vi' // the locale you want

registerLocale('vi', vi) // register it with the name you want

Sidebar.propTypes = {
  filters: PropTypes.object,
  onSubmit: PropTypes.func
}

function Sidebar({ filters, onSubmit, loading, onRefresh }) {
  const [ListType, setListType] = useState([])
  const [loadingType, setLoadingType] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const { isSidebar, onHideSidebar } = useContext(TelesalesContext)
  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv?.hasRight || false
  }))

  useEffect(() => {
    getTypeConfig()
  }, [])

  const getTypeConfig = async () => {
    setLoadingType(true)
    try {
      const { data } = await configApi.getConfigName('tagkh')
      if (data && data.data && data?.data.length > 0) {
        const result = JSON.parse(data.data[0].Value)
        setListType(result)
      }
      setLoadingType(false)
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitTransfer = (values, { resetForm }) => {
    setBtnLoading(true)
    const dataSubmit = {
      FromTeleUserID: values.FromTeleUserID ? values.FromTeleUserID.value : '',
      ToTeleUserID: values.ToTeleUserID ? values.ToTeleUserID.value : ''
    }
    telesalesApi
      .transferMember(dataSubmit)
      .then(response => {
        onRefresh(() => {
          setBtnLoading(false)
          resetForm()
          onHideModal()
          window.top?.toastr &&
            window.top?.toastr.success('Chuy???n ?????i th??nh c??ng', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onOpenModal = () => {
    setIsModal(true)
  }

  const onHideModal = () => {
    setIsModal(false)
  }

  return (
    <>
      <div
        className={clsx(
          'telesales-list__sidebar bg-white',
          isSidebar && 'show'
        )}
      >
        <MemberTransfer
          show={isModal}
          loading={btnLoading}
          onSubmit={onSubmitTransfer}
          onHide={onHideModal}
        />
        <Formik
          initialValues={filters}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {formikProps => {
            // errors, touched, handleChange, handleBlur
            const { values, setFieldValue, handleChange, handleBlur } =
              formikProps

            return (
              <Form className="d-flex flex-column h-100">
                <div className="border-bottom p-15px text-uppercase fw-600 font-size-lg position-relative">
                  B??? l???c kh??ch h??ng
                  {teleAdv && (
                    <div
                      className="cursor-pointer position-absolute top-8px right-10px w-40px h-40px d-flex align-items-center justify-content-center"
                      onClick={onOpenModal}
                    >
                      <i className="fa-regular fa-users-gear text-primary"></i>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1 p-15px overflow-auto">
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted">T??? kh??a</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nh???p t??? kh??a"
                      name="filter.key"
                      value={values.filter.key}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {loadingType &&
                    Array(2)
                      .fill()
                      .map((item, index) => (
                        <div className="mb-15px form-group" key={index}>
                          <label className="font-label text-muted">
                            <Skeleton count={1} width={100} />
                          </label>
                          <div className="checkbox-list mt-8px">
                            {Array(2)
                              .fill()
                              .map((x, idx) => (
                                <label
                                  className="checkbox d-flex cursor-pointer"
                                  key={idx}
                                >
                                  <input
                                    type="checkbox"
                                    name="filter.tele_process"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <span className="checkbox-icon"></span>
                                  <span className="fw-500 font-label">
                                    <Skeleton count={1} width={100} />
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                  {!loadingType &&
                    ListType &&
                    ListType.map((type, index) => (
                      <div className="mb-15px form-group" key={index}>
                        <label className="font-label text-muted">
                          {type.Title}
                        </label>
                        <div className="checkbox-list mt-8px">
                          {type.Children &&
                            type.Children.map((x, idx) => (
                              <label
                                className="checkbox d-flex cursor-pointer"
                                key={idx}
                              >
                                <input
                                  type="checkbox"
                                  name="filter.tele_process"
                                  value={x.Title}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <span className="checkbox-icon"></span>
                                <span className="fw-500 font-label">
                                  {x.Title}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>
                    ))}
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      C?? s???
                    </label>
                    <SelectStocks
                      name="filter.StockID"
                      placeholder="Ch???n c?? c???"
                      classNamePrefix="select"
                      className="select-control"
                      value={values?.filter?.StockID}
                      onChange={otp => {
                        setFieldValue('filter.StockID', otp ? otp.value : '')
                      }}
                    />
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      T??m theo SP, DV kh??ch quan t??m
                    </label>
                    <SelectProductService
                      isMulti
                      menuPosition="fixed"
                      menuPlacement="top"
                      name="filter.wishlist"
                      onChange={otp => {
                        setFieldValue('filter.wishlist', otp, false)
                      }}
                      value={values.filter.wishlist}
                      isClearable={true}
                    />
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Kh??ch h??ng sinh nh???t
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          calendarClassName="hide-header"
                          onChange={date => {
                            setFieldValue('filter.birthDateFrom', date, false)
                          }}
                          selected={values.filter.birthDateFrom}
                          placeholderText="T??? ng??y"
                          className="form-control"
                          dateFormat="dd/MM"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                      <div className="w-35px d-flex align-items-center justify-content-center">
                        <i className="fa-regular fa-arrow-right-long text-muted"></i>
                      </div>
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.birthDateTo', date, false)
                          }}
                          selected={values.filter.birthDateTo}
                          placeholderText="?????n ng??y"
                          className="form-control"
                          dateFormat="dd/MM"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Kh??ch c?? ?????t l???ch
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.bookDateFrom', date, false)
                          }}
                          selected={values.filter.bookDateFrom}
                          placeholderText="T??? ng??y"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                      <div className="w-35px d-flex align-items-center justify-content-center">
                        <i className="fa-regular fa-arrow-right-long text-muted"></i>
                      </div>
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.bookDateTo', date, false)
                          }}
                          selected={values.filter.bookDateTo}
                          placeholderText="?????n ng??y"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Kh??ch c?? l???ch nh???c
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.NotiFrom', date, false)
                          }}
                          selected={values.filter.NotiFrom}
                          placeholderText="T??? ng??y"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                      <div className="w-35px d-flex align-items-center justify-content-center">
                        <i className="fa-regular fa-arrow-right-long text-muted"></i>
                      </div>
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.NotiTo', date, false)
                          }}
                          selected={values.filter.NotiTo}
                          placeholderText="?????n ng??y"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted">
                      S??? ng??y kh??ch ch??a ?????n c?? s???
                    </label>
                    <NumericFormat
                      allowNegative={false}
                      name="filter.last_used"
                      placeholder="Nh???p s??? ng??y"
                      className={`form-control`}
                      //isNumericString={true}
                      //thousandSeparator={true}
                      value={values.filter.last_used}
                      onValueChange={val => {
                        setFieldValue(
                          'filter.last_used',
                          val.floatValue ? val.floatValue : val.value
                        )
                      }}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />
                  </div>
                  <div
                    className={`${clsx('form-group', teleAdv && 'mb-15px')}`}
                  >
                    <label className="font-label text-muted">
                      Kh??ch h???t s???n ph???m trong s??? ng??y t???i
                    </label>
                    <NumericFormat
                      allowNegative={false}
                      name="filter.remains"
                      placeholder="Nh???p s??? ng??y"
                      className={`form-control`}
                      //isNumericString={true}
                      //thousandSeparator={true}
                      value={values.filter.remains}
                      onValueChange={val => {
                        setFieldValue(
                          'filter.remains',
                          val.floatValue ? val.floatValue : val.value
                        )
                      }}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />
                  </div>
                  {teleAdv && (
                    <>
                      <div className="form-group">
                        <label className="font-label text-muted mb-5px">
                          Ch???n theo nh??n vi??n
                        </label>
                        <SelectStaffs
                          adv={true}
                          className="select-control"
                          menuPosition="fixed"
                          menuPlacement="top"
                          name="filter.tele_user_id"
                          onChange={otp => {
                            setFieldValue('filter.tele_user_id', otp, false)
                          }}
                          value={values.filter.tele_user_id}
                          isClearable={true}
                        />
                      </div>
                      <label className="checkbox d-flex cursor-pointer mt-20px">
                        <input
                          type="checkbox"
                          name="filter.emptyStaff"
                          value={values.filter.emptyStaff}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="checkbox-icon"></span>
                        <span className="fw-500 font-label">
                          Ch??a ch???n nh??n vi??n ph??? tr??ch
                        </span>
                      </label>
                    </>
                  )}
                </div>
                <div className="border-top p-15px d-flex">
                  <button
                    type="button"
                    className="btn btn-secondary h-42px mr-8px d-lg-none"
                    onClick={onHideSidebar}
                  >
                    ????ng
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      'btn btn-primary w-100 text-uppercase fw-500 h-42px font-size-base flex-fill',
                      loading && 'spinner spinner-white spinner-right mr-3'
                    )}
                    disabled={loading}
                  >
                    T??m ki???m kh??ch h??ng
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
      <div
        className={clsx('telesales-list__sidebar--bg', isSidebar && 'show')}
        onClick={onHideSidebar}
      ></div>
    </>
  )
}

export default Sidebar
