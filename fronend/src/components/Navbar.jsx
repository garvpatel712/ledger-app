import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from '../utils/axios';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl md:text-2xl font-semibold">Transaction App</h1>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-blue-200 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-white">Welcome, {user.username}</span>
                <Link to="/dashboard" className="text-white hover:text-blue-200 font-medium">
                  Dashboard
                </Link>
                <Link to="/add" className="text-white hover:text-blue-200 font-medium">
                  Add Entry
                </Link>
                <button onClick={handleLogout} className="text-white hover:text-blue-200 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-200 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-white hover:text-blue-200 font-medium">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          {user ? (
            <div className="flex flex-col space-y-3 pb-3">
              <span className="text-white">Welcome, {user.username}</span>
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-200 font-medium block"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/add"
                className="text-white hover:text-blue-200 font-medium block"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Entry
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-blue-200 font-medium text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pb-3">
              <Link
                to="/login"
                className="text-white hover:text-blue-200 font-medium block"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-blue-200 font-medium block"
                onClick={() => setIsMenuOpen(false)}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
