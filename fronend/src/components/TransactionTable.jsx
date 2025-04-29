import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

// Helper function to format numbers to 2 decimal places
const formatNumber = (num) => {
  return Number(num).toFixed(2);
};

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, dateFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/transactions");

      // Sort transactions by date (newest first)
      const sortedTransactions = response.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || "Failed to fetch transactions");
      }
    } finally {
      setLoading(false);
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
        await axios.delete(`/transactions/${id}`);
        // Refresh the transactions list
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          alert("Failed to delete transaction");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchTransactions}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by party name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
        <Link
          to="/add"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Entry
        </Link>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">No transactions found</p>
          <Link
            to="/add"
            className="text-blue-500 hover:text-blue-600"
          >
            Add your first transaction
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Date</th>
                <th className="px-6 py-3 border-b text-left">Party</th>
                <th className="px-6 py-3 border-b text-left">Rate</th>
                <th className="px-6 py-3 border-b text-left">Bags</th>
                <th className="px-6 py-3 border-b text-left">Gross Weight</th>
                <th className="px-6 py-3 border-b text-left">Kapat/Bag</th>
                <th className="px-6 py-3 border-b text-left">Kapat</th>
                <th className="px-6 py-3 border-b text-left">Net Weight</th>
                <th className="px-6 py-3 border-b text-left">Net Amount</th>
                <th className="px-6 py-3 border-b text-left">Commission</th>
                <th className="px-6 py-3 border-b text-left">Bardan Market</th>
                <th className="px-6 py-3 border-b text-left">Tolai</th>
                <th className="px-6 py-3 border-b text-left">Market Fee</th>
                <th className="px-6 py-3 border-b text-left">Total</th>
                <th className="px-6 py-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">{transaction.party}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.rate)}</td>
                  <td className="px-6 py-4 border-b">{transaction.bag}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.grossWeight)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.kapatPerBag)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.kapat)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.netWeight)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.netAmount)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.commission)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.bardanMarket)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.tolai)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.marketFee)}</td>
                  <td className="px-6 py-4 border-b">{formatNumber(transaction.total)}</td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-entry/${transaction._id}`}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
