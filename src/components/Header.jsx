/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/devtinderlog.png";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import api from "../axios/api";

function Header() {
  const userData = useSelector((state) => state.user);
  const disPatch = useDispatch();
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      disPatch(removeUser());
      navigate("/login");
    } catch (error) {
      disPatch(removeUser());
      navigate("/login");
    }
  };
  return (
    <div>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1 border-none">
          <Link to={userData ? "/" : "/login"} className="">
            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-12 object-contain"
            />
          </Link>
        </div>
        {userData && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
            <div className="dropdown dropdown-end mx-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      logOut();
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
