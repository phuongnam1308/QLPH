import React from "react";
import { Outlet } from 'react-router-dom';

const MainLayout = (): React.JSX.Element => {
  return (
    <div> 
      <Outlet />
    </div>
  );
};

export default MainLayout;
