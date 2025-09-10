import React from "react";
import FeedCard from "./FeedCard";
import useFeedData from "../utils/useFeedData";

const Feed = () => {
  const { feedData, loading, error } = useFeedData();

  if (loading) return <h1 className="text-center">Loading...</h1>;
  if (error)
    return <h1 className="text-center text-red-500">Error loading feed</h1>;
  if (!feedData || feedData.length === 0)
    return <h1 className="text-center">No data</h1>;

  // Pick a random user
  const randomIndex = Math.floor(Math.random() * feedData.length);
  const randomUser = feedData[randomIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <FeedCard user={randomUser} />
    </div>
  );
};

export default Feed;
