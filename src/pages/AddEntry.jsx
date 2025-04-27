import { useState, useEffect } from "react";
import axios from "axios";

function AddEntry() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [party, setParty] = useState("");
  const [rate, setRate] = useState("");
  const [bag, setBag] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [kapatPerBag, setKapatPerBag] = useState(1.75);
  const [recentEntries, setRecentEntries] = useState([]);

  // Fetch recent entries when component mounts
  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions");
      // Sort entries by _id in descending order (newest first) and take first 5
      const sortedEntries = response.data
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, 5);
      setRecentEntries(sortedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const calculateFields = () => {
    const kapat = kapatPerBag * bag;
    const netWeight = grossWeight - kapat;
    const netAmount = rate * (netWeight / 20);
    const commission = netAmount * (1.25 / 100);
    const bardanMarket = bag * 15;
    const tolai = bag * 5;
    const total = netAmount + commission + bardanMarket + tolai;

    return { netWeight, netAmount, commission, bardanMarket, tolai, total };
  };

  const { netWeight, netAmount, commission, bardanMarket, tolai, total } = calculateFields();

  const clearForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setParty("");
    setRate("");
    setBag("");
    setGrossWeight("");
    setKapatPerBag(1.75);
  };

  const handleSave = async () => {
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
      total,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/transactions/add", newTransaction);
      if (response.status === 201) {
        alert("Entry saved successfully!");
        clearForm();
        fetchRecentEntries(); // Refresh the entries list
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Error saving entry!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Transaction</h2>

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
            <label className="w-1/3 font-semibold">Party Name:</label>
            <input
              type="text"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Rate (₹):</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bag (Qty):</label>
            <input
              type="number"
              value={bag}
              onChange={(e) => setBag(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Gross Weight:</label>
            <input
              type="number"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Kapat per Bag:</label>
            <input
              type="number"
              value={kapatPerBag}
              onChange={(e) => setKapatPerBag(e.target.value)}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Kapat:</label>
            <input
              type="number"
              value={kapatPerBag * bag}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Net Weight:</label>
            <input
              type="number"
              value={netWeight}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Net Amount:</label>
            <input
              type="number"
              value={netAmount}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Commission:</label>
            <input
              type="number"
              value={commission}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bardan Market:</label>
            <input
              type="number"
              value={bardanMarket}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Tolai:</label>
            <input
              type="number"
              value={tolai}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Total:</label>
            <input
              type="number"
              value={total}
              readOnly
              className="w-2/3 px-4 py-2 border border-gray-300 rounded bg-gray-100 font-bold"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>

      {/* Recent Entries Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Party</th>
                <th className="py-2 px-4 border">Rate</th>
                <th className="py-2 px-4 border">Bags</th>
                <th className="py-2 px-4 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{entry.party}</td>
                  <td className="py-2 px-4 border">{entry.rate}</td>
                  <td className="py-2 px-4 border">{entry.bag}</td>
                  <td className="py-2 px-4 border">{entry.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddEntry;
