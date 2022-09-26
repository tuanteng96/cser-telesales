import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import SelectProgress from 'src/components/Selects/SelectProgress'
import { useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'

ProgressList.propTypes = {
  initialValues: PropTypes.string,
  MemberLoading: PropTypes.bool
}

function ProgressList({ initialValues, MemberLoading, ...props }) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState(null)

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
      <SelectProgress
        isLoading={loading || MemberLoading}
        //isDisabled={loading}
        isMulti
        className="w-100"
        placeholder="Chọn Tags khách hàng"
        onChange={onSubmit}
        value={values}
      />
    </div>
  )
}

export default ProgressList
