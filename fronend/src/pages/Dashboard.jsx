import { useState } from "react";
import { Link } from "react-router-dom";
import TransactionTable from "../components/TransactionTable";

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">Transaction Dashboard</h1>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <button
            onClick={handleRefresh}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
          >
            Refresh
          </button>
          <Link
            to="/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center w-full md:w-auto"
          >
            Add New Transaction
          </Link>
        </div>
      </div>
      <TransactionTable key={refreshKey} />
    </div>
  );
}

export default Dashboard;
