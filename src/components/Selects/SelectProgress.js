import React, { useEffect, useMemo } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import useTagKh from 'src/hooks/useTagKh'
import clsx from 'clsx'
import { useTeleDetail } from 'src/features/Telesales/pages/TelesalesDetail/TelesalesDetailLayout'

SelectProgress.propTypes = {
  onChange: PropTypes.func
}

function SelectProgress({ onChange, value, isLoading, className, ...props }) {
  const { data: groups, isLoading: loading } = useTagKh()
  const { setTagsList } = useTeleDetail()

  const options = useMemo(
    () =>
      (groups || []).map(item => ({
        value: item.Title,
        label: item.Title,
        options: item.Children.map(o => ({
          value: o.Title,
          label: o.Title
        }))
      })),
    [groups]
  )

  useEffect(() => {
    setTagsList && setTagsList(options)
  }, [options, setTagsList])

  return (
    <Select
      {...props}
      isLoading={isLoading || loading}
      classNamePrefix="select"
      className={clsx('select-control', className)}
      options={options}
      value={value}
      onChange={onChange}
      noOptionsMessage={({ inputValue }) => 'Không có dữ liệu'}
    />
  )
}

export default SelectProgress
