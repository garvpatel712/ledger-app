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
    const tolai = bag * 2;
    const marketFee = bag * 3;
    const total = netAmount + commission + bardanMarket + tolai + marketFee;

    return { kapat, netWeight, netAmount, commission, bardanMarket, tolai, marketFee, total };
  };

  const { kapat, netWeight, netAmount, commission, bardanMarket, tolai, marketFee, total } = calculateFields();

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
        marketFee,
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
    <div className="max-w-4xl mx-auto mt-4 md:mt-10 p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Edit Transaction</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Party:</label>
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter party name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate:</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bags:</label>
                <input
                  type="number"
                  name="bag"
                  value={formData.bag}
                  onChange={handleChange}
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
                  name="grossWeight"
                  value={formData.grossWeight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter gross weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapat per Bag:</label>
                <input
                  type="number"
                  name="kapatPerBag"
                  value={formData.kapatPerBag}
                  onChange={handleChange}
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
                  value={netWeight}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount:</label>
                <input
                  type="text"
                  value={netAmount}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission:</label>
                <input
                  type="text"
                  value={commission}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bardan Market:</label>
                <input
                  type="text"
                  value={bardanMarket}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tolai:</label>
                <input
                  type="text"
                  value={tolai}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Fee:</label>
                <input
                  type="text"
                  value={marketFee}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total:</label>
              <input
                type="text"
                value={total}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 font-bold text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
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
