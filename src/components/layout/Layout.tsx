import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SideNav from './SideNav';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-w-[1080px] min-h-screen bg-gray-50">
      <TopNav />
      <div className="flex flex-1 pt-[140px]">
        <SideNav />
        <main className="flex-1 ml-[240px] p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
