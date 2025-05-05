import clsx from 'clsx'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'

function Navbar({ ExportExcel, IsLoadingEx }) {
  const { width } = useWindowSize()

  const { AuthID, auth } = useSelector(({ auth }) => ({
    AuthID: auth?.Info?.User?.ID,
    auth: auth
  }))

  console.log(AuthID)
  
  return (
    <>
      {width > 767 ? (
        <>
          {(window?.top?.GlobalConfig?.Admin?.byAdminExcel
            ? AuthID === 1
            : !window?.top?.GlobalConfig?.Admin?.byAdminExcel) && (
            <button
              id="export-excel"
              className={clsx(
                'btn btn-success fw-500 py-6px d-flex align-items-center mr-8px',
                IsLoadingEx && 'spinner spinner-white spinner-right mr-3'
              )}
              type="button"
              onClick={ExportExcel}
              disabled={IsLoadingEx}
            >
              Xuất Excel
            </button>
          )}
          <NavLink
            to="/danh-sach"
            className={({ isActive }) =>
              isActive
                ? 'btn btn-primary fw-500 py-6px d-flex align-items-center'
                : 'btn btn-out btn-default fw-500 py-6px'
            }
          >
            <i className="far fa-list pr-5px"></i>
            <span className="d-none d-md-inline-block">Danh sách</span>
          </NavLink>
          <NavLink
            to="/thong-ke/danh-sach"
            className={({ isActive }) =>
              isActive
                ? 'btn btn-primary ml-8px fw-500'
                : 'btn btn-out btn-default ml-8px fw-500'
            }
          >
            <i className="far fa-sort-amount-up-alt pr-5px"></i>
            <span className="d-none d-md-inline-block">Thống kê</span>
          </NavLink>
          <NavLink
            to="/lich-nhac/danh-sach"
            className={({ isActive }) =>
              isActive
                ? 'btn btn-primary ml-8px fw-500'
                : 'btn btn-out btn-default ml-8px fw-500'
            }
          >
            <i className="far fa-bells pr-5px"></i>
            <span className="d-none d-md-inline-block">Lịch nhắc</span>
          </NavLink>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle className="dropdown-toggle btn-primary">
            <i className="far fa-list pr-5px"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {(window?.top?.GlobalConfig?.Admin?.byAdminExcel
              ? AuthID === 1
              : !window?.top?.GlobalConfig?.Admin?.byAdminExcel) && (
              <button
                className={clsx(
                  'text-primary fw-500 d-block py-8px text-decoration-none',
                  IsLoadingEx && 'spinner spinner-white spinner-right mr-3'
                )}
                type="button"
                onClick={ExportExcel}
                disabled={IsLoadingEx}
              >
                Xuất Excel
              </button>
            )}
            <NavLink
              to="/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-8px text-decoration-none'
                  : 'fw-500 d-block py-8px text-decoration-none'
              }
            >
              <i className="far fa-list pr-5px"></i>
              <span>Danh sách</span>
            </NavLink>
            <NavLink
              to="/thong-ke/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-6px text-decoration-none'
                  : 'fw-500 d-block py-6px text-decoration-none'
              }
            >
              <i className="far fa-sort-amount-up-alt pr-5px"></i>
              <span>Thống kê</span>
            </NavLink>
            <NavLink
              to="/lich-nhac/danh-sach"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary fw-500 d-block py-6px text-decoration-none'
                  : 'fw-500 d-block py-6px text-decoration-none'
              }
            >
              <i className="far fa-bells pr-5px"></i>
              <span>Lịch nhắc</span>
            </NavLink>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  )
}

export default Navbar
