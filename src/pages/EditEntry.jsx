import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";

// Helper function to format numbers to 2 decimal places
const formatNumber = (num) => {
  return Number(num).toFixed(2);
};

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
      setError(null);
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.get(`/transactions/${id}`);
      const transaction = response?.data;

      if (!transaction) {
        setError("Transaction not found");
        setLoading(false);
        return;
      }

      // Convert IDs to strings for comparison
      const currentUserId = user._id?.toString();
      const transactionUserId = transaction.userId?.toString();

      // Only check ownership if both IDs exist
      if (currentUserId && transactionUserId && currentUserId !== transactionUserId) {
        setError("You don't have permission to edit this transaction");
        setLoading(false);
        return;
      }

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
      console.error("Error fetching transaction:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Failed to fetch transaction. Please try again.");
      }
      setLoading(false);
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
      setError(null);
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

      await axios.put(`/transactions/${id}`, updatedTransaction);
      alert("Transaction updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating transaction:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Failed to update transaction. Please try again.");
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
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchTransaction}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Transaction</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Party:</label>
            <input
              type="text"
              name="party"
              value={formData.party}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter party name"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Rate:</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter rate"
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3 font-semibold">Bags:</label>
            <input
              type="number"
              name="bag"
              value={formData.bag}
              onChange={handleChange}
              className="w-2/3 px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter number of bags"
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
              placeholder="Enter gross weight"
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
              step="0.01"
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

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEntry;
