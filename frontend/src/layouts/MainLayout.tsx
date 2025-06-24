import React from "react";
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
const MainLayout = (): React.JSX.Element => {
  return (
    <div> 

      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
