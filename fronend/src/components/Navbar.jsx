import { Link, useNavigate } from "react-router-dom";
import axios from '../utils/axios';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      localStorage.removeItem('user');
      // Force a full page reload to ensure all components are updated
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">Transaction App</h1>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.username}</span>
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-200 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/add"
                className="text-white hover:text-blue-200 font-medium"
              >
                Add Entry
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-blue-200 font-medium"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
