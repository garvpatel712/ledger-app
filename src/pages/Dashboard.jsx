import { useNavigate } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    date: "09-04-2025",
    party: "Chamunda",
    rate: 1700,
    bag: 16,
    gross: 250,
    net: 222,
    total: 19425.87
  },
  {
    id: 2,
    date: "09-04-2025",
    party: "Bhuchar",
    rate: 1600,
    bag: 21,
    gross: 278,
    net: 241,
    total: 19961.25
  }
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <button
        onClick={() => navigate('/add')}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Entry
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Party</th>
              <th className="py-2 px-4">Rate</th>
              <th className="py-2 px-4">Bag</th>
              <th className="py-2 px-4">Gross</th>
              <th className="py-2 px-4">Net</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4 text-center">{item.date}</td>
                <td className="py-2 px-4 text-center">{item.party}</td>
                <td className="py-2 px-4 text-center">{item.rate}</td>
                <td className="py-2 px-4 text-center">{item.bag}</td>
                <td className="py-2 px-4 text-center">{item.gross}</td>
                <td className="py-2 px-4 text-center">{item.net}</td>
                <td className="py-2 px-4 text-center">{item.total}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/edit/${item.id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert('Delete feature coming soon!')}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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
  );
}

export default Dashboard;
