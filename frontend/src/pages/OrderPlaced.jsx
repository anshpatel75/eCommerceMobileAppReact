// src/pages/OrderPlaced.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/OrderPlaced.css";

const OrderPlaced = () => {
  return (
    <div className="order-placed-container">
      <h2>Your Order has been Placed Successfully!</h2>
      <p>Thank you for shopping with us.</p>
      <Link to="/orders/history" className="view-orders-link">View Order History</Link>
    </div>
  );
};

export default OrderPlaced;
