import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

// Helper function to format numbers to 2 decimal places
const formatNumber = (num) => {
  return Number(num).toFixed(2);
};

function AddEntry() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [party, setParty] = useState("");
  const [rate, setRate] = useState("");
  const [bag, setBag] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [kapatPerBag, setKapatPerBag] = useState(1.75);
  const [recentEntries, setRecentEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch recent entries when component mounts
  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      setError("");
      const response = await axios.get("/transactions");
      // Sort entries by _id in descending order (newest first) and take first 5
      const sortedEntries = response.data
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, 5);
      setRecentEntries(sortedEntries);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Failed to fetch recent entries. Please try again.");
      }
    }
  };

  const calculateFields = () => {
    const kapat = kapatPerBag * bag;
    const netWeight = grossWeight - kapat;
    const netAmount = rate * (netWeight / 20);
    const commission = netAmount * (1.25 / 100);
    const bardanMarket = bag * 15;
    const tolai = bag * 2;
    const marketFee = bag * 3;
    const total = netAmount + commission + bardanMarket + tolai + marketFee;

    return { netWeight, netAmount, commission, bardanMarket, tolai, marketFee, total };
  };

  const { netWeight, netAmount, commission, bardanMarket, tolai, marketFee, total } = calculateFields();

  const clearForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setParty("");
    setRate("");
    setBag("");
    setGrossWeight("");
    setKapatPerBag(1.75);
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const newTransaction = {
      date,
      party,
      rate,
      bag,
      grossWeight,
      kapatPerBag,
      kapat: kapatPerBag * bag,
      netWeight,
      netAmount,
      commission,
      bardanMarket,
      tolai,
      marketFee,
      total,
      userId: user._id
    };

    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/transactions/add", newTransaction);
      if (response.status === 201) {
        alert("Entry saved successfully!");
        clearForm();
        fetchRecentEntries(); // Refresh the entries list
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Failed to save entry. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-10 p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Add New Transaction</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Party:</label>
                <input
                  type="text"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter party name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate:</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bags:</label>
                <input
                  type="number"
                  value={bag}
                  onChange={(e) => setBag(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of bags"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight:</label>
                <input
                  type="number"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter gross weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapat per Bag:</label>
                <input
                  type="number"
                  value={kapatPerBag}
                  onChange={(e) => setKapatPerBag(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-semibold mb-4">Calculated Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight:</label>
                <input
                  type="text"
                  value={formatNumber(netWeight)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount:</label>
                <input
                  type="text"
                  value={formatNumber(netAmount)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission:</label>
                <input
                  type="text"
                  value={formatNumber(commission)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bardan Market:</label>
                <input
                  type="text"
                  value={formatNumber(bardanMarket)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tolai:</label>
                <input
                  type="text"
                  value={formatNumber(tolai)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Fee:</label>
                <input
                  type="text"
                  value={formatNumber(marketFee)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total:</label>
              <input
                type="text"
                value={formatNumber(total)}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 font-bold text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4 mt-6">
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full md:w-auto"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4">Recent Entries</h3>
        {recentEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bags</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Weight</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{entry.party}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{formatNumber(entry.rate)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{entry.bag}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{formatNumber(entry.netWeight)}</td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm whitespace-nowrap">{formatNumber(entry.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent entries found</p>
        )}
      </div>
    </div>
  );
}

export default AddEntry;
