import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import configApi from 'src/api/config.api'
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
import SelectProduct from 'src/components/Selects/SelectProduct'
import Select from 'react-select'
import vi from 'date-fns/locale/vi' // the locale you want
import MemberTransferImport from './MemberTransferImport'
import { Dropdown } from 'react-bootstrap'
import SelectServiceCard from 'src/components/Selects/SelectServiceCard'


registerLocale('vi', vi) // register it with the name you want

Sidebar.propTypes = {
  filters: PropTypes.object,
  onSubmit: PropTypes.func
}

const OsList = [
  {
    value: 0,
    label: 'Hết thẻ'
  },
  {
    value: 1,
    label: 'Còn thẻ'
  },
  // {
  //   value: 2,
  //   label: 'Chưa mua'
  // }
]

function Sidebar({ filters, onSubmit, loading, onRefresh }) {
  const [ListType, setListType] = useState([])
  const [loadingType, setLoadingType] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [btnLoadingImport, setBtnLoadingImport] = useState(false)
  const [btnLoadingReset, setBtnLoadingReset] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [isModalImport, setIsModalImport] = useState(false)
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
            window.top?.toastr.success('Chuyển đổi thành công', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onSubmitTransferImport = (values, { resetForm }) => {
    setBtnLoadingImport(true)
    const dataSubmit = {
      ...values,
      users: values.users ? values.users.map(x => x.value).join(',') : ''
    }

    telesalesApi
      .transferMemberImport(dataSubmit)
      .then(response => {
        onRefresh(() => {
          setBtnLoadingImport(false)
          resetForm()
          onHideModalImport()
          window.top?.toastr &&
            window.top?.toastr.success('Chuyển đổi thành công', '', {
              timeOut: 1500
            })
        })
      })
      .catch(error => console.log(error))
  }

  const onResetMember = () => {
    setBtnLoadingReset(true)
    telesalesApi
      .transferMemberReset()
      .then(response => {
        onRefresh(() => {
          setBtnLoadingReset(false)
          onHideModalImport()
          window.top?.toastr &&
            window.top?.toastr.success('Chuyển đổi thành công', '', {
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

  const onOpenModalImport = () => {
    setIsModalImport(true)
  }

  const onHideModalImport = () => {
    setIsModalImport(false)
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
        <MemberTransferImport
          show={isModalImport}
          loading={btnLoadingImport}
          onSubmit={onSubmitTransferImport}
          onHide={onHideModalImport}
          onResetMember={onResetMember}
          loadingReset={btnLoadingReset}
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
                  Bộ lọc khách hàng
                  {teleAdv && (
                    <div className="cursor-pointer position-absolute top-8px right-10px">
                      <Dropdown>
                        <Dropdown.Toggle
                          className="btn-out cursor-pointer w-40px h-40px d-flex align-items-center justify-content-center bg-white"
                          style={{
                            background: '#fff !important'
                          }}
                        >
                          <i className="fa-regular fa-users-gear text-primary"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            className="text-capitalize"
                            href="#"
                            onClick={onOpenModal}
                          >
                            Chuyển đổi khách hàng
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-capitalize"
                            href="#"
                            onClick={onOpenModalImport}
                          >
                            Import khách hàng
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1 p-15px overflow-auto">
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted">Từ khóa</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập từ khóa"
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
                                  checked={values?.filter?.tele_process.includes(
                                    x.Title
                                  )}
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
                      Cơ sở
                    </label>
                    <SelectStocks
                      name="filter.StockID"
                      placeholder="Chọn cơ cở"
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
                      Tìm theo SP, DV khách quan tâm
                    </label>
                    <SelectProduct
                      className="select-control"
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
                      Ngày tạo khách hàng
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          calendarClassName="hide-header"
                          onChange={date => {
                            setFieldValue('filter.CreateFrom', date, false)
                          }}
                          selected={values.filter.CreateFrom}
                          placeholderText="Từ ngày"
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
                            setFieldValue('filter.CreateTo', date, false)
                          }}
                          selected={values.filter.CreateTo}
                          placeholderText="Đến ngày"
                          className="form-control"
                          dateFormat="dd/MM"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Khách hàng sinh nhật
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          calendarClassName="hide-header"
                          onChange={date => {
                            setFieldValue('filter.birthDateFrom', date, false)
                          }}
                          selected={values.filter.birthDateFrom}
                          placeholderText="Từ ngày"
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
                          placeholderText="Đến ngày"
                          className="form-control"
                          dateFormat="dd/MM"
                          dateFormatCalendar="MMMM"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Khách có đặt lịch
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.bookDateFrom', date, false)
                          }}
                          selected={values.filter.bookDateFrom}
                          placeholderText="Từ ngày"
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
                          placeholderText="Đến ngày"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted mb-5px">
                      Khách có lịch nhắc
                    </label>
                    <div className="d-flex">
                      <div className="flex-fill">
                        <DatePicker
                          onChange={date => {
                            setFieldValue('filter.NotiFrom', date, false)
                          }}
                          selected={values.filter.NotiFrom}
                          placeholderText="Từ ngày"
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
                          placeholderText="Đến ngày"
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-15px form-group">
                    <label className="font-label text-muted">
                      Số ngày khách chưa đến cơ sở
                    </label>
                    <NumericFormat
                      allowNegative={false}
                      name="filter.last_used"
                      placeholder="Nhập số ngày"
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
                      Khách hết sản phẩm trong số ngày tới
                    </label>
                    <NumericFormat
                      allowNegative={false}
                      name="filter.remains"
                      placeholder="Nhập số ngày"
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
                  <div className="form-group mb-15px">
                    <label className="font-label text-muted mb-5px">
                      Loại thẻ dịch vụ
                    </label>
                    <Select
                      classNamePrefix="select"
                      options={OsList}
                      className="select-control"
                      name="osCount"
                      value={values?.filter?.osCount}
                      onChange={otp => {
                        setFieldValue('filter.osCount', otp)
                      }}
                      placeholder="Chọn"
                      isClearable
                    />
                  </div>
                  <div className="form-group mb-15px">
                    <label className="font-label text-muted mb-5px">
                      Dịch vụ thẻ
                    </label>
                    <SelectServiceCard
                      isMulti
                      name="ServiceCardIDs"
                      value={values?.filter?.ServiceCardIDs}
                      onChange={otp => {
                        setFieldValue('filter.ServiceCardIDs', otp)
                      }}
                      isClearable
                      menuPosition="fixed"
                      styles={{
                        menuPortal: base => ({
                          ...base,
                          zIndex: 9999
                        })
                      }}
                      menuPortalTarget={document.body}
                    />
                  </div>
                  {teleAdv && (
                    <>
                      <div className="form-group">
                        <label className="font-label text-muted mb-5px">
                          Chọn theo nhân viên
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
                          Chưa chọn nhân viên phụ trách
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
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      'btn btn-primary w-100 text-uppercase fw-500 h-42px font-size-base flex-fill',
                      loading && 'spinner spinner-white spinner-right mr-3'
                    )}
                    disabled={loading}
                  >
                    Tìm kiếm khách hàng
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
