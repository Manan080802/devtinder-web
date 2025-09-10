import React from "react";
import { defaultImages } from "../config/defaultImages";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";
import api from "../axios/api";
import status from "daisyui/components/status";

const FeedCard = ({ user }) => {
  const disPatch = useDispatch();
  if (!user) return null;

  const profileImage =
    user.profileImg ||
    (user.gender?.toLowerCase() === "male"
      ? defaultImages.male
      : user.gender?.toLowerCase() === "female"
      ? defaultImages.female
      : defaultImages.other);

  const handleAction = async (action) => {
    try {
      if (action === "reject") {
        const result = await api.post(
          `/request/send/ignored/${user._id}`,
          {},
          {
            withCredentials: true,
          }
        );
      }

      if (action === "accept") {
        const result = await api.post(
          `/request/send/interested/${user._id}`,
          {},
          {
            withCredentials: true,
          }
        );
      }

      disPatch(removeFeedUser(user._id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-6 bg-base-200 rounded-2xl shadow-xl w-96 text-center">
      {/* User Image */}
      <div className="flex justify-center mb-4">
        <img
          src={profileImage}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-72 h-auto object-cover rounded-xl shadow-md"
        />
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-bold mb-2 capitalize">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-gray-500 text-sm mb-4">{user.email}</p>

      {/* Skills */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {user.skill?.map((s, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-primary text-white rounded-full text-sm"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        {/* Reject Button */}
        <button
          onClick={() => {
            handleAction("reject");
          }}
          className="btn btn-error text-white px-6 shadow-lg 
               hover:scale-105 active:scale-95 
               transition-all duration-200 flex items-center gap-2"
        >
          {/* X Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Reject
        </button>

        {/* Accept Button */}
        <button
          onClick={() => {
            handleAction("accept");
          }}
          className="btn btn-success text-white px-6 shadow-lg 
               hover:scale-105 active:scale-95 
               transition-all duration-200 flex items-center gap-2"
        >
          {/* Check Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          Accept
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
