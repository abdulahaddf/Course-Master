import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)




  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          CourseMaster
        </NavLink>
        
        <ul className="navbar-nav">
          <li>
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <span className="nav-link">
                  Welcome, {user?.name}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar