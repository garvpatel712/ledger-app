import TransactionTable from "../components/TransactionTable";

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">All Transactions</h1>
      </div>
      <TransactionTable />
    </div>
  );
}

export default Dashboard;
