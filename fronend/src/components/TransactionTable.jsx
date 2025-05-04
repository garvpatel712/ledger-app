import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transactions Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Define the columns for the table - now including all fields
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Party', dataKey: 'party' },
      { header: 'Rate', dataKey: 'rate' },
      { header: 'Bags', dataKey: 'bag' },
      { header: 'Gross Weight', dataKey: 'grossWeight' },
      { header: 'Kapat/Bag', dataKey: 'kapatPerBag' },
      { header: 'Kapat', dataKey: 'kapat' },
      { header: 'Net Weight', dataKey: 'netWeight' },
      { header: 'Net Amount', dataKey: 'netAmount' },
      { header: 'Commission', dataKey: 'commission' },
      { header: 'Bardan Market', dataKey: 'bardanMarket' },
      { header: 'Tolai', dataKey: 'tolai' },
      { header: 'Market Fee', dataKey: 'marketFee' },
      { header: 'Total', dataKey: 'total' }
    ];

    // Prepare the data with all fields
    const data = filteredTransactions.map(transaction => ({
      date: new Date(transaction.date).toLocaleDateString(),
      party: transaction.party,
      rate: formatNumber(transaction.rate),
      bag: transaction.bag,
      grossWeight: formatNumber(transaction.grossWeight),
      kapatPerBag: formatNumber(transaction.kapatPerBag),
      kapat: formatNumber(transaction.kapat),
      netWeight: formatNumber(transaction.netWeight),
      netAmount: formatNumber(transaction.netAmount),
      commission: formatNumber(transaction.commission),
      bardanMarket: formatNumber(transaction.bardanMarket),
      tolai: formatNumber(transaction.tolai),
      marketFee: formatNumber(transaction.marketFee),
      total: formatNumber(transaction.total)
    }));

    // Generate the table
    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey])),
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save('transactions-report.pdf');
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
    <div className="container mx-auto px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by party name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-auto"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-auto"
          />
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
          >
            Export PDF
          </button>
          <Link
            to="/add"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            Add New Entry
          </Link>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center p-4 md:p-8">
          <p className="text-gray-500 mb-4">No transactions found</p>
          <Link
            to="/add"
            className="text-blue-500 hover:text-blue-600"
          >
            Add your first transaction
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Party</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Rate</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bags</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Gross Weight</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Kapat/Bag</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Kapat</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Weight</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Amount</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Commission</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bardan Market</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tolai</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Market Fee</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {transaction.party}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.rate)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {transaction.bag}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.grossWeight)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.kapatPerBag)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.kapat)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.netWeight)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.netAmount)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.commission)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.bardanMarket)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.tolai)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.marketFee)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                      {formatNumber(transaction.total)}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">
                      <div className="flex space-x-3">
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
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
