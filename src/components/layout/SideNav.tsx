import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

const SideNav: React.FC = () => {
  return (
    <nav className="side-nav">
      <ul>
        <li>
          <NavLink to="/stores" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">🏪</span>
            <span className="label">Stores</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/skus" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📦</span>
            <span className="label">SKUs</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/planning" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📊</span>
            <span className="label">Planning</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/chart" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📈</span>
            <span className="label">Chart</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
