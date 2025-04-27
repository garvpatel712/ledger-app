
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">Transaction App</h1>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/add"
            className="text-white hover:text-blue-200 font-medium"
          >
            Add Entry
          </Link>
          <Link
            to="/transactions"
            className="text-white hover:text-blue-200 font-medium"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
