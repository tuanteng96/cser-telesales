import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import PropTypes from 'prop-types'
import moreApi from 'src/api/more.api'

SelectServiceCard.propTypes = {
  onChange: PropTypes.func
}

function SelectServiceCard({ onChange, value, ...props }) {
  const getAllServiceCard = async (search, loadedOptions, { page }) => {
    const { data } = await moreApi.getAllServiceCard(search)
    const newData =
      data.data && data.data.length > 0
        ? data.data.filter(x => x.suffix !== "Thẻ PP").map(item => ({
            ...item,
            label: item.text,
            value: item.id
          }))
        : []
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
      className="select-control"
      classNamePrefix="select"
      loadOptions={getAllServiceCard}
      placeholder="Chọn thẻ"
      value={value}
      onChange={onChange}
      additional={{
        page: 1
      }}
      noOptionsMessage={({ inputValue }) => 'Không có dữ liệu'}
    />
  )
}

export default SelectServiceCard
