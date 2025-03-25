import React from 'react';

// Dummy transaction data
const transactions = [
  {
    id: 'txn_1234567890',
    date: '2023-06-15',
    customer: 'John Doe',
    amount: 129.99,
    status: 'Completed',
    items: ['Wireless Headphones']
  },
  {
    id: 'txn_0987654321',
    date: '2023-06-14',
    customer: 'Jane Smith',
    amount: 329.98,
    status: 'Completed',
    items: ['Smart Watch', 'Bluetooth Speaker']
  },
  {
    id: 'txn_1122334455',
    date: '2023-06-12',
    customer: 'Bob Johnson',
    amount: 59.99,
    status: 'Completed',
    items: ['Laptop Backpack']
  },
  {
    id: 'txn_5566778899',
    date: '2023-06-10',
    customer: 'Alice Williams',
    amount: 249.99,
    status: 'Refunded',
    items: ['Smart Watch']
  },
  {
    id: 'txn_9988776655',
    date: '2023-06-08',
    customer: 'Charlie Brown',
    amount: 209.98,
    status: 'Completed',
    items: ['Wireless Headphones', 'Laptop Backpack']
  }
];

const TransactionHistory: React.FC = () => {
  return (
    <div className="transaction-history">
      <div className="transaction-filters">
        <input 
          type="text" 
          placeholder="Search by transaction ID or customer" 
          className="search-input"
        />
        <select className="filter-status">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="pending">Pending</option>
        </select>
        <div className="date-filters">
          <input type="date" className="date-filter" placeholder="From" />
          <input type="date" className="date-filter" placeholder="To" />
        </div>
      </div>
      
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(txn => (
            <tr key={txn.id} className={`transaction-row ${txn.status.toLowerCase()}`}>
              <td>{txn.id}</td>
              <td>{txn.date}</td>
              <td>{txn.customer}</td>
              <td>{txn.items.join(', ')}</td>
              <td>${txn.amount.toFixed(2)}</td>
              <td>
                <span className={`status-badge ${txn.status.toLowerCase()}`}>
                  {txn.status}
                </span>
              </td>
              <td>
                <button className="view-details-btn">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <button className="pagination-btn">Previous</button>
        <span className="page-info">Page 1 of 1</span>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  );
};

export default TransactionHistory; 