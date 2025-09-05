import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { defaultImages } from "../config/defaultImages";

const Profile = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400">No profile found. Please login.</p>
      </div>
    );
  }

  const profileImage =
    userData.profileImg ||
    (userData.gender?.toLowerCase() === "male"
      ? defaultImages.male
      : userData.gender?.toLowerCase() === "female"
      ? defaultImages.female
      : defaultImages.other);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-base-300 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg mb-4 object-cover"
          />

          <h2 className="text-2xl font-bold text-white text-center mb-4">
            My Profile
          </h2>
        </div>

        <div className="space-y-4 text-gray-200">
          <p>
            <span className="font-semibold">Name:</span> {userData.firstName}{" "}
            {userData.lastName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {userData.gender}
          </p>
          <p>
            <span className="font-semibold">DOB:</span> {userData.dob}
          </p>
          <p>
            <span className="font-semibold">Skills:</span>{" "}
            {userData.skill?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.skill.map((s, i) => (
                  <span key={i} className="badge badge-primary py-2 px-3">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              "No skills added"
            )}
          </p>
        </div>

        <button
          className="btn btn-secondary w-full mt-6"
          onClick={() => navigate("/update-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
