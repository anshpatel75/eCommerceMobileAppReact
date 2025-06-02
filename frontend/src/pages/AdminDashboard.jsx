// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import AddProductForm from "../components/AddProductForm";
import ProductTable from "../components/ProductTable";
import "../styles/AdminPanel.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAddProduct = (newProduct) => {
    fetch("http://localhost:8000/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => setProducts((prev) => [...prev, data]));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };


  const handleUpdateProduct = (product) => {
    fetch(`http://localhost:8000/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((updated) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProduct(null);
      });
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    }).then(() => setProducts((prev) => prev.filter((p) => p.id !== id)));
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <div className="topbar">Welcome, Admin</div>
        <div className="admin-dashboard">
          <h2 style={{ marginBottom: "20px" }}>Product Management</h2>
          <AddProductForm
            onAdd={handleAddProduct}
            editingProduct={editingProduct}
            onUpdate={handleUpdateProduct}
          />
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
