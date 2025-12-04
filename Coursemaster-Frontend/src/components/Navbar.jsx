import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <header className="mb-2 fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Glass container */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl text-black rounded-b-2xl py-3 px-5 flex items-center justify-between">
          
          {/* Brand */}
          <Link
            to="/"
            className="text-black font-semibold text-3xl border-0"
          >
            CourseMaster
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-6 text-black/90 text-base">
            <li>
              <Link className="hover:text-black" to="/">
                Home
              </Link>
            </li>

            { user ? (
              <>
             

                {user.role === "student" && (
                  <li>
                    <Link className="hover:text-black" to="/dashboard">
                    Dashboard
                  </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li>
                    <Link className="hover:text-black" to="/admin">
                       Admin Dashboard
                    </Link>
                  </li>
                )}

                

                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="hover:text-black" to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-black/95 hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl py-4 px-5 shadow-xl text-black">
            <ul className="flex flex-col gap-4 text-lg">
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>

              {user ? (
                <>
                  {user.role === "student" && (
                  <li>
                    <Link className="hover:text-black" to="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li>
                    <Link className="hover:text-black" to="/admin" onClick={() => setOpen(false)}>
                       Admin Dashboard
                    </Link>
                  </li>
                )}

               

                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="btn btn-primary"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
