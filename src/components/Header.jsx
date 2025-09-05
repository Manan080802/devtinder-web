/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/devtinderlog.png";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import api from "../axios/api";
import { defaultImages } from "../config/defaultImages";

function Header() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fallback profile image
  const profileImage =
    userData?.profileImg ||
    (userData?.gender?.toLowerCase() === "male"
      ? defaultImages.male
      : userData?.gender?.toLowerCase() === "female"
      ? defaultImages.female
      : defaultImages.other);

  const logOut = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
    } catch (error) {
      console.error("Logout failed, forcing local logout:", error);
    } finally {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1 border-none">
        <Link to={userData ? "/" : "/login"}>
          <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain" />
        </Link>
      </div>

      {userData && (
        <div className="flex gap-2">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Profile" src={profileImage} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={logOut}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
