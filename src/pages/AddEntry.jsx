import { useState } from "react";
import axios from "axios";

function AddEntry() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today
  const [party, setParty] = useState("");
  const [rate, setRate] = useState("");
  const [bag, setBag] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [kapatPerBag, setKapatPerBag] = useState(1.75);

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
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Error saving entry!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="w-1/3">Kapat:</label>
            <span className="w-2/3">{kapatPerBag * bag}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3">Net Weight:</label>
            <span className="w-2/3">{netWeight}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3">Net Amount:</label>
            <span className="w-2/3">{netAmount}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3">Commission:</label>
            <span className="w-2/3">{commission}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3">Bardan Market:</label>
            <span className="w-2/3">{bardanMarket}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="w-1/3">Tolai:</label>
            <span className="w-2/3">{tolai}</span>
          </div>

          <div className="flex justify-between items-center font-semibold">
            <label className="w-1/3">TOTAL:</label>
            <span className="w-2/3">{total}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Save Entry
          </button>
          <button
            type="button"
            onClick={() => alert("Cancel")}
            className="bg-gray-300 text-black px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEntry;
