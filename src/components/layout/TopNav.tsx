import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import AuthForm from '../auth/AuthForm';
import gsynergyLogo from '../../assets/gsynergy_logo.jpg';

const TopNav: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md h-[140px] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex-shrink-0 flex items-center space-x-4">
            <img
              className="h-[120px] w-[120px] object-contain"
              src={gsynergyLogo}
              alt="GSynergy Logo"
            />
            <div className="h-12 w-px bg-gray-200" /> {/* Vertical divider */}
            <span className="text-2xl font-semibold text-gray-900">
              Data Viewer
            </span>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-700">
                  Welcome, <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {showAuthForm && !isAuthenticated && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </nav>
  );
};

export default TopNav;
