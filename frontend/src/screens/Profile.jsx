import React, { useEffect } from "react";
import MetaData from "../MetaData";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  Cog6ToothIcon,
  KeyIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { getMyWishlist, loadUser, logout } from "../Actions/user";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <MetaData title={`Profile`} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {user?.role === "admin" && (
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="cursor-pointer bg-gray-100 my-3 mt-7 mx-10 rounded-md hover:bg-gray-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <DashboardOutlinedIcon
                  className=" text-black mr-3"
                  style={{
                    fontSize: window.innerWidth < 400 ? "25px" : "36px",
                  }}
                />
                <p className="font-serif text-slate-700 md:text-xl text-base">
                  Dashboard
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-600" />
            </div>
          )}

          <div
            onClick={() => navigate("/orders")}
            className="cursor-pointer bg-gray-100 my-3 mx-10 rounded-md hover:bg-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <ListAltIcon
                className=" text-black mr-3"
                style={{ fontSize: window.innerWidth < 400 ? "25px" : "36px" }}
              />
              <p className="font-serif text-slate-700 md:text-xl text-base">
                My Orders
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-600" />
          </div>

          <div
            onClick={() => navigate("/me/update")}
            className="cursor-pointer bg-gray-100 my-3 mx-10 rounded-md hover:bg-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Cog6ToothIcon className="md:h-8 md:w-8 h-6 w-6 mr-3 text-black" />
              <p className="font-serif text-slate-700 md:text-xl text-base">
                Edit Profile
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-600" />
          </div>

          <div
            onClick={() => navigate("/password/update")}
            className="cursor-pointer bg-gray-100 my-3 mx-10 rounded-md hover:bg-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <KeyIcon className="md:h-8 md:w-8 h-6 w-6 mr-3 text-black" />
              <p className="font-serif text-slate-700  md:text-xl text-base">
                Update Password
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-600" />
          </div>

          <div
            onClick={() => {
              dispatch(logout());
              dispatch(loadUser());
              dispatch(getMyWishlist());
              navigate("/");
            }}
            className="cursor-pointer bg-gray-100 my-3 mx-10 rounded-md hover:bg-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <ExitToAppIcon
                className=" text-black mr-3"
                style={{ fontSize: window.innerWidth < 400 ? "25px" : "36px" }}
              />
              <p className="font-serif text-slate-700  md:text-xl text-base">
                Logout
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-600" />
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
