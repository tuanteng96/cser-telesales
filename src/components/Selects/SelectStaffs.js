import React, { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import PropTypes from 'prop-types'
import moreApi from 'src/api/more.api'
import { isArray } from 'lodash'
import { useSelector } from 'react-redux'

SelectStaffs.propTypes = {
  onChange: PropTypes.func
}

function SelectStaffs({ onChange, value, isLoading, ...props }) {
  const { Stocks } = useSelector(({ auth }) => ({
    Stocks: auth?.PermissionStocks
  }))
  const [loading, setLoading] = useState(false)

  const getAllStaffs = async (search, loadedOptions, { page }) => {
    setLoading(true)
    const { data } = await moreApi.getAllStaffs(search)
    const { Items } = {
      Items: data.data || []
    }
    let newData = []

    if (Items && isArray(Items)) {
      for (let key of Items) {
        const { group, groupid, text, id } = key
        const index = newData.findIndex(item => item.groupid === groupid)
        if (index > -1) {
          newData[index].options.push({ label: text, value: id, ...key })
        } else {
          const newItem = {}
          newItem.label = group
          newItem.groupid = groupid
          newItem.options = [{ label: text, value: id, ...key }]
          newData.push(newItem)
        }
      }
      if (Stocks !== 'All Stocks') {
        newData = newData.filter(
          o => Stocks && Stocks.some(x => x.ID === o.groupid)
        )
      }
    }
    setLoading(false)
    return {
      options: newData,
      hasMore: false,
      additional: {
        page: 1
      }
    }
  }

  return (
    <AsyncPaginate
      {...props}
      isLoading={isLoading || loading}
      classNamePrefix="select"
      loadOptions={getAllStaffs}
      placeholder="Chọn nhân viên"
      value={value}
      onChange={onChange}
      additional={{
        page: 1
      }}
      noOptionsMessage={({ inputValue }) => 'Không có nhân viên'}
    />
  )
}

export default SelectStaffs
