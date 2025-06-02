import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";

const AddProductForm = ({ onAdd, editingProduct, onUpdate }) => {
  const [product, setProduct] = useState({
    id: null,
    name: "",
    price: "",
    inventory: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, inventory, image, description } = product;
    if (!name || !price || !inventory || !image || !description) return;

    if (editingProduct) {
      onUpdate(product);
    } else {
      onAdd(product);
    }

    setProduct({
      name: "",
      price: "",
      inventory: "",
      image: "",
      description: "",
    });
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      <InputField
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        required
      />

      <InputField
        type="number"
        name="price"
        placeholder="Product Price"
        value={product.price}
        onChange={handleChange}
        required
      />

      <InputField
        type="number"
        name="inventory"
        placeholder="Inventory Count"
        value={product.inventory}
        onChange={handleChange}
        required
      />

      <InputField
        type="text"
        name="image"
        placeholder="Image URL"
        value={product.image}
        onChange={handleChange}
        required
      />

      <TextareaField
        name="description"
        placeholder="Product Description"
        value={product.description}
        onChange={handleChange}
        rows={4}
        required
      />

      <button type="submit">
        {editingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
