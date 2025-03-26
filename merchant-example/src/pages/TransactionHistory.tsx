import React, {  useEffect, useState } from "react";


interface CheckoutSession {
  amount: number;
  callback_url: string;
  details: string;
  requester_wallet: string;
  status: string;
  timestamp: number;
  expiration_timestamp: number | null;
  token: string;
  transaction_id: string;
  txhash: string;
  type: string;
  email_linked: boolean;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<CheckoutSession[]>([]);

  // Write a function to fetch the transactions from the database
  const fetchCheckouts = async () => {
    try {
      const response = await fetch(`https://py.api.orbitalpay.xyz/merchants/fetch-checkouts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ORBITAL_PRIVATE_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checkout session');
      }
      const data = await response.json();
      setTransactions(data);
      return data;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
    }
  };
  
  useEffect(() => {
    if (transactions.length === 0) {
      fetchCheckouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format transaction ID to show first 2 and last 6 characters
  const formatTransactionId = (id: string) => {
    if (!id) return '-';
    return `${id.substring(0, 2)}...${id.substring(id.length - 6)}`;
  };

  // Uncomment and update the formatTxHash function
  const formatTxHash = (hash: string | null) => {
    if (!hash) return 'Pending';
    return `${hash.substring(0, 4)}...${hash.substring(hash.length - 2)}`;
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format amount (assuming it's in smallest units)
  const formatAmount = (amount: number, token: string) => {
    // Dividing by 10^6 for USDC which has 6 decimals
    const formattedAmount = (amount / 1000000).toFixed(2);
    return `${formattedAmount} ${token}`;
  };

  // Get status style class based on status value
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'paid' || statusLower === 'completed') return 'status-paid';
    if (statusLower === 'cancelled' || statusLower === 'canceled') return 'status-cancelled';
    if (statusLower === 'pending') return 'status-pending';
    return '';
  };

  // Sort transactions in reverse chronological order (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="transaction-history">      
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Txn Hash</th>
          </tr>
        </thead>
        <tbody>
          { sortedTransactions && sortedTransactions.map(txn => (
            <tr key={txn.transaction_id} className={`transaction-row ${txn.status.toLowerCase()}`}>
              <td>{formatTransactionId(txn.transaction_id)}</td>
              <td>{formatDate(txn.timestamp)}</td>
              <td>{formatAmount(txn.amount, txn.token)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(txn.status)}`}>
                  {txn.status}
                </span>
              </td>
              <td>
                {txn.txhash ? (
                  <a 
                    href={`https://explorer.aptoslabs.com/txn/${txn.txhash}?network=testnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="txhash-link"
                  >
                    {formatTxHash(txn.txhash)}
                  </a>
                ) : (
                  <span className="pending-txhash">---</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* <div className="pagination">
        <button className="pagination-btn">Previous</button>
        <span className="page-info">Page 1 of 1</span>
        <button className="pagination-btn">Next</button>
      </div> */}
    </div>
  );
};

export default TransactionHistory; 