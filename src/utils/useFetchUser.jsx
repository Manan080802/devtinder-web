import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../axios/api";
import { addUser } from "./userSlice";

const useFetchUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user/profile", {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            "If-None-Match": "",
          },
        });

        dispatch(addUser(response?.data?.result));
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  return user; // ✅ now hook returns user data
};

export default useFetchUser;
