import React from "react";
import { Link, Outlet } from 'react-router-dom';

const MainLayout = (): React.JSX.Element => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/booking">Booking</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
};

export default MainLayout;
