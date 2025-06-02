import React, { useEffect, useState } from "react";
import "../styles/OrderHistory.css";

const OrderHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.userid;
    if (user) {
      fetch(`http://localhost:8000/orders/history?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((err) => console.error("Error fetching history:", err));
    }
  }, []);

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Order History</h2>
      {history.length === 0 ? (
        <p className="order-history-empty">No order history found.</p>
      ) : (
        history.map((order, index) => (
          <div key={index} className="order-card">
            <h4 className="order-date">
              Order placed on: {new Date(order.created_at).toLocaleString()}
            </h4>
            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx} className="order-item">
                  <span>{item.product_name}</span>
                  <span>₹{item.price}</span>
                  <span>Qty: {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
