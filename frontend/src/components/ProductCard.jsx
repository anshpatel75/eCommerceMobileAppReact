import react from "react";
import "../styles/products.css"; 
import "../styles/AddProductForm.css"; 
const ProductCard = ({ name, image, price, onAddToCart }) => (
  <div className="product-card">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>₹{price}</p>
    <button onClick={onAddToCart}>Add to Cart</button>
  </div>
);

export default ProductCard;
