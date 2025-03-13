import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import moreApi from 'src/api/more.api'

function SelectGroupsMember({ ...props }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchOption = async () => {
      const { data } = await moreApi.getGroupsMember()
      setOptions(
        data?.MemberGroups
          ? data?.MemberGroups.map(x => ({ ...x, label: x.Title, value: x.ID }))
          : []
      )
    }
    fetchOption()
  }, [])

  return (
    <Select
      placeholder="Chọn nhóm khách hàng"
      classNamePrefix="select"
      options={options || []}
      className="select-control"
      {...props}
    />
  )
}

export default SelectGroupsMember
