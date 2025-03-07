import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsShop, BsBox, BsClipboardData, BsGraphUp } from 'react-icons/bs';

interface NavItemProps {
  to: string;
  label: string;
  Icon: React.ElementType;
}

const NavItem = ({ to, label, Icon }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : ''}`
      }
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <Icon />
      </div>
      <span className="ml-3 font-medium">{label}</span>
    </NavLink>
  );
};

const SideNav = () => {
  const navItems: NavItemProps[] = [
    { to: '/stores', Icon: BsShop, label: 'Stores' },
    { to: '/skus', Icon: BsBox, label: 'SKUs' },
    { to: '/planning', Icon: BsClipboardData, label: 'Planning' },
    { to: '/chart', Icon: BsGraphUp, label: 'Chart' }
  ];

  return (
    <nav className="fixed left-0 top-[140px] h-[calc(100vh-140px)] w-sidenav bg-white shadow-md z-40">
      <ul className="py-4 space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;
