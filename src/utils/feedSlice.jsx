import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    data: [], // list of unique users
  },
  reducers: {
    addFeedUser: (state, action) => {
      const newUsers = action.payload.data || [];

      // merge old + new, keep unique by _id
      const allUsers = [...state.data, ...newUsers];
      const uniqueUsers = allUsers.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );

      state.data = uniqueUsers;
    },

    removeFeedUser: (state, action) => {
      // remove user by _id
      const userId = action.payload;
      state.data = state.data.filter((u) => u._id !== userId);
    },

    clearFeed: (state) => {
      state.data = [];
    },
  },
});

export const { addFeedUser, removeFeedUser, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
