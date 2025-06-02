import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";
import { useCart } from "../context/CartContext";
import mixpanel from "../utils/mixpanel";



const ITEMS_PER_PAGE = 8;

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();


  // Fetch products from FastAPI backend
  useEffect(() => {
    fetch("http://localhost:8000/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="page-wrapper">
      <div className="grid-container">
        {currentProducts.map((product, index) => (
          <ProductCard key={index} {...product} onAddToCart={() => addToCart({...product, id: product.id})} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &laquo; Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
