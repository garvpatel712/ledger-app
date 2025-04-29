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
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Transaction</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Party:</label>
            <input
              type="text"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter party name"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Rate:</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter rate"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bags:</label>
            <input
              type="number"
              value={bag}
              onChange={(e) => setBag(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter number of bags"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Gross Weight:</label>
            <input
              type="number"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter gross weight"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Kapat per Bag:</label>
            <input
              type="number"
              value={kapatPerBag}
              onChange={(e) => setKapatPerBag(parseFloat(e.target.value))}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              step="0.01"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Net Weight:</label>
            <input
              type="text"
              value={formatNumber(netWeight)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Net Amount:</label>
            <input
              type="text"
              value={formatNumber(netAmount)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Commission:</label>
            <input
              type="text"
              value={formatNumber(commission)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bardan Market:</label>
            <input
              type="text"
              value={formatNumber(bardanMarket)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Tolai:</label>
            <input
              type="text"
              value={formatNumber(tolai)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Market Fee:</label>
            <input
              type="text"
              value={formatNumber(marketFee)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Total:</label>
            <input
              type="text"
              value={formatNumber(total)}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100 font-bold"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Entries Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
        {recentEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Party</th>
                  <th className="px-4 py-2">Rate</th>
                  <th className="px-4 py-2">Bags</th>
                  <th className="px-4 py-2">Net Weight</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{entry.party}</td>
                    <td className="px-4 py-2">{formatNumber(entry.rate)}</td>
                    <td className="px-4 py-2">{entry.bag}</td>
                    <td className="px-4 py-2">{formatNumber(entry.netWeight)}</td>
                    <td className="px-4 py-2">{formatNumber(entry.total)}</td>
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
