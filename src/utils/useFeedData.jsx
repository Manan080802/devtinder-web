import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../axios/api";
import { addFeedUser } from "../utils/feedSlice";

const useFeedData = (pageNumber = 1, limit = 5) => {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feed.data);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // 👈 prevents repeated calls

  const getResult = async () => {
    try {
      setLoading(true);
      const result = await api.get("/user/feed", {
        withCredentials: true,
        params: { pageNumber, limit },
      });

      const users = result?.data?.result || [];
      dispatch(addFeedUser(users));
      setHasFetched(true); // 👈 mark as fetched (even if empty)
    } catch (err) {
      setError(err);
      console.error("Error fetching feed:", err);
      setHasFetched(true); // 👈 avoid infinite retries
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      getResult();
    }
  }, [hasFetched]);

  return { feedData, loading, error };
};

export default useFeedData;
