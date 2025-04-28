# Ledger Application

A modern web application for managing transactions with a focus on agricultural commodity trading. Built with React, Node.js, Express, and MongoDB.

## Features

- **Transaction Management**
  - Add new transactions with detailed information
  - Edit existing transactions
  - Delete transactions
  - View all transactions in a table format

- **Search and Filter**
  - Search transactions by party name
  - Filter transactions by date
  - Real-time filtering and search results

- **Automatic Calculations**
  - Kapat calculation based on bag quantity
  - Net weight calculation
  - Net amount calculation
  - Commission calculation (1.25%)
  - Bardan market charges
  - Tolai charges
  - Total amount calculation

## Tech Stack

- **Frontend**
  - React.js
  - React Router for navigation
  - Axios for API calls
  - Tailwind CSS for styling

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ledger_app
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ledger_app
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ledger_app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── TransactionTable.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddEntry.jsx
│   │   │   └── EditEntry.jsx
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── models/
│   │   └── transactions.js
│   ├── routes/
│   │   └── transactions.js
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get a single transaction
- `POST /api/transactions/add` - Add a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Transaction Fields

- Date
- Party Name
- Rate (₹)
- Bag Quantity
- Gross Weight
- Kapat per Bag (default: 1.75)
- Kapat (calculated)
- Net Weight (calculated)
- Net Amount (calculated)
- Commission (1.25% of net amount)
- Bardan Market (₹15 per bag)
- Tolai (₹5 per bag)
- Total Amount (calculated)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact the project maintainer.
