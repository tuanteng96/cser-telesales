import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import SelectProgress from 'src/components/Selects/SelectProgress'
import { useNavigate, useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import { TelesalesContext } from '../..'

ProgressList.propTypes = {
  initialValues: PropTypes.string,
  MemberLoading: PropTypes.bool
}

function ProgressList({ initialValues, MemberLoading, ...props }) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState(null)
  const { onOpenProfile } = useContext(TelesalesContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (initialValues) {
      setValues(() =>
        initialValues.split(',').map(item => ({
          label: item,
          value: item
        }))
      )
    }
  }, [initialValues])

  const onSubmit = otp => {
    setLoading(true)
    let newData = {
      items: [
        {
          MemberID: MemberID,
          TeleTags: otp ? otp.map(item => item.value).join(',') : ''
        }
      ]
    }
    telesalesApi
      .editTagsMember(newData)
      .then(response => {
        setValues(otp)
        setLoading(true)
      })
      .catch(error => console.log(error))
  }
  return (
    <div className="telesales-detail-head border-bottom px-18px d-flex align-items-center justify-content-center">
      <div
        className="w-40px h-40px border rounded-circle cursor-pointer position-relative mr-10px d-xxl-none"
        onClick={() => navigate('/danh-sach')}
      >
        <i className="fa-regular fa-arrow-left position-absolute left-12px top-12px"></i>
      </div>
      <SelectProgress
        isLoading={loading || MemberLoading}
        //isDisabled={loading}
        isMulti
        className="w-100 flex-1"
        placeholder="Chọn Tags khách hàng"
        onChange={onSubmit}
        value={values}
      />
      <div
        className="w-40px h-40px border rounded-circle cursor-pointer position-relative ml-10px d-xxl-none bg-primary shadow"
        onClick={onOpenProfile}
      >
        <i className="fa-solid fa-user text-white position-absolute left-13px top-12px"></i>
      </div>
    </div>
  )
}

export default ProgressList
