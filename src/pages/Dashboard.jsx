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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaction Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={handleRefresh}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
          <Link
            to="/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
