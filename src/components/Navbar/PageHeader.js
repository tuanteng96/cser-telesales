import React from 'react'
import PropTypes from 'prop-types'
import Navbar from './Navbar'

function PageHeader({
  title,
  total,
  unit,
  onExport,
  isExporting,
  onOpenSidebar,
  onRefresh
}) {
  return (
    <div className="border-bottom fw-600 font-size-lg position-relative tw-flex-shrink-0">
      <div className="tw-py-[16px]">
        {unit ? (
          <>
            <span className="text-uppercase">{title} -</span>
            <span className="text-danger pl-3px">{total}</span>
            <span className="pl-5px font-label text-muted font-size-sm text-none">
              {unit}
            </span>
          </>
        ) : (
          <span className="tw-text-[25px] tw-font-extrabold tw-leading-[32px]">
            {title} ({total})
          </span>
        )}
      </div>
      <div className="w-full">
        <Navbar
          ExportExcel={onExport}
          IsLoadingEx={isExporting}
          onOpenSidebar={onOpenSidebar}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string,
  onExport: PropTypes.func.isRequired,
  isExporting: PropTypes.bool,
  onOpenSidebar: PropTypes.func.isRequired,
  onRefresh: PropTypes.func
}

export default PageHeader
