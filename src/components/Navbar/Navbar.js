import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useWindowSize } from 'src/hooks/useWindowSize'

function Navbar(props) {
  const { width } = useWindowSize()
  return (
    <>
      {width > 767 ? (
        <>
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
