import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import AuthForm from '../auth/AuthForm';
import gsynergyLogo from '../../assets/gsynergy_logo.jpg';

const TopNav: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-auto sm:h-16" // Increased logo size
                src={gsynergyLogo}
                alt="GSynergy Logo"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!showMobileMenu ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${showMobileMenu ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {isAuthenticated ? (
            <div className="px-4 py-2 space-y-2">
              <div className="text-gray-700">{user?.name}</div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthForm(true);
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Auth form modal */}
      {showAuthForm && !isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <AuthForm mode="login" onClose={() => setShowAuthForm(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
