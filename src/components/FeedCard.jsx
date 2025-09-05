import React from "react";

const FeedCard = ({ user, onLike, onDislike }) => {
  if (!user) return null;

  const profileImage =
    user.profileImg || "https://via.placeholder.com/300x200.png?text=No+Image";

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
      <div className="flex justify-around mt-4">
        <button
          onClick={onDislike}
          className="btn btn-error text-white rounded-full w-14 h-14 text-lg"
        >
          ❌
        </button>
        <button
          onClick={onLike}
          className="btn btn-success text-white rounded-full w-14 h-14 text-lg"
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
