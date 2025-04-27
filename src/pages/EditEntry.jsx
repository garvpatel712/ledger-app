import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    party: "",
    rate: "",
    bag: "",
    grossWeight: "",
    kapatPerBag: 1.75
  });

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/${id}`);
      const transaction = response.data;
      setFormData({
        date: new Date(transaction.date).toISOString().split('T')[0],
        party: transaction.party,
        rate: transaction.rate,
        bag: transaction.bag,
        grossWeight: transaction.grossWeight,
        kapatPerBag: transaction.kapatPerBag
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transaction");
      setLoading(false);
      console.error("Error fetching transaction:", err);
    }
  };

  const calculateFields = () => {
    const { rate, bag, grossWeight, kapatPerBag } = formData;
    const kapat = kapatPerBag * bag;
    const netWeight = grossWeight - kapat;
    const netAmount = rate * (netWeight / 20);
    const commission = netAmount * (1.25 / 100);
    const bardanMarket = bag * 15;
    const tolai = bag * 5;
    const total = netAmount + commission + bardanMarket + tolai;

    return { kapat, netWeight, netAmount, commission, bardanMarket, tolai, total };
  };

  const { kapat, netWeight, netAmount, commission, bardanMarket, tolai, total } = calculateFields();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTransaction = {
        ...formData,
        kapat,
        netWeight,
        netAmount,
        commission,
        bardanMarket,
        tolai,
        total
      };

      await axios.put(`http://localhost:5000/api/transactions/${id}`, updatedTransaction);
      alert("Transaction updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Error updating transaction!");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Party Name:</label>
            <input
              type="text"
              name="party"
              value={formData.party}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Rate (₹):</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bag (Qty):</label>
            <input
              type="number"
              name="bag"
              value={formData.bag}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Gross Weight:</label>
            <input
              type="number"
              name="grossWeight"
              value={formData.grossWeight}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Kapat per Bag:</label>
            <input
              type="number"
              name="kapatPerBag"
              value={formData.kapatPerBag}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Kapat:</label>
            <input
              type="number"
              value={kapat}
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

          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Entry
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEntry;
