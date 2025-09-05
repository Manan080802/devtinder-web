import React, { useEffect } from "react";
import FeedCard from "./FeedCard";
import { useDispatch, useSelector } from "react-redux";
import api from "../axios/api";
import { addFeedUser } from "../utils/feedSlice";

const useFeedData = () => {
  const disPatch = useDispatch();
  const getResult = async () => {
    try {
      const result = await api.get("/user/feed", {
        withCredentials: true,
        params: { pageNumber: 1, limit: 5 },
      });
      disPatch(addFeedUser(result?.data?.result));
    } catch (err) {
      console.log(err);
    }
  };
  const feedData = useSelector((state) => state.feed.data);
  useEffect(() => {
    feedData.length == 0 && getResult();
  }, [feedData]);
  return feedData;
};
const Feed = () => {
  const FeedData = useSelector((state) => state.feed.data);
  useFeedData();
  // pick a random user
  const randomIndex = Math.floor(Math.random() * FeedData.length);
  const randomUser = FeedData[randomIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <FeedCard user={randomUser}></FeedCard>
    </div>
  );
};

export default Feed;
