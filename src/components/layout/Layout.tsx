import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SideNav from './SideNav';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <TopNav />
      <div className="content-wrapper">
        <SideNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
