import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.userid;

    const payload = {
    user_id: user_id,
    items: cart.map(item => ({
      product_id: parseInt(item.product_id),
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  };

  console.log("🚀 Payload being sent to backend:", payload);

    const res = await fetch("http://localhost:8000/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user_id,
        items: cart.map(item => ({
          product_id: parseInt(item.product_id),       // ✅ Ensure integer
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error("Order creation failed");
    }

    clearCart();
    navigate("/order-placed");
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Qty</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td><img src={item.image} alt={item.name} className="cart-img" /></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.price * item.quantity}</td>
              <td>
                <button onClick={() => removeFromCart(item.product_id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <h3 className="total-amount">Total: ₹{totalPrice}</h3>
        {cart.length > 0 && (
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
