import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, dateFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions");
      // Sort by _id in descending order to show latest first
      const sortedTransactions = response.data.sort((a, b) => 
        b._id.localeCompare(a._id)
      );
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transactions");
      setLoading(false);
      console.error("Error fetching transactions:", err);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by party name
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.party.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate === dateFilter;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        // Refresh the transactions list
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
        alert("Failed to delete transaction");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Party Name
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter party name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.party}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.bag}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.grossWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.netWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.netAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {transaction.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      to={`/edit/${transaction._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
