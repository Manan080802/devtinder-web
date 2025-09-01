import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

import useFetchUser from "../utils/useFetchUser";

const Body = () => {
  useFetchUser();

  return (
    <div>
      <Header />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default Body;
