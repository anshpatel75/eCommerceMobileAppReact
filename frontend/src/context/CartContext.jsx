// CartContext.jsx
/*import React, { createContext, useContext, useState, useEffect } from "react";
import mixpanel from "../utils/mixpanel";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = async (product, user_id) => {
  const existingIndex = cart.findIndex(
    (item) => item.product_id === product.id
  );

  let updatedCart;

  if (existingIndex !== -1) {
    // Update quantity locally
    updatedCart = [...cart];
    updatedCart[existingIndex].quantity += 1;
  } else {
    const cartItem = {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      user_id,
    };
    updatedCart = [...cart, cartItem];
  }

  // Sync with backend (always send quantity=1 for add)
  const res = await fetch(`http://localhost:8000/cart/add?user_id=${user_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }),
  });

  if (res.ok) {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert("Product added to cart!");
  } else {
    alert("Failed to add to cart.");
  }
};


  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);*/

// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import mixpanel from "../utils/mixpanel";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.userid;

  useEffect(() => {
    if (user_id) {
      fetch(`http://localhost:8000/cart/items?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch((err) => console.error("Failed to load cart items:", err));
    }
  }, [user_id]);

  const addToCart = async (product) => {
    const res = await fetch(`http://localhost:8000/cart/add?user_id=${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      }),
    });

    if (res.ok) {
      // Refresh cart from DB after add
      const updated = await fetch(`http://localhost:8000/cart/items?user_id=${user_id}`)
        .then((res) => res.json());
      setCart(updated);
      alert("Product added to cart!");

      mixpanel.track("Added to Cart", {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
      });
    } else {
      alert("Failed to add to cart.");
    }
  };

  /*const removeFromCart = async (product_id) => {
    const res = await fetch(`http://localhost:8000/cart/remove?user_id=${user_id}&product_id=${product_id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      const updated = await fetch(`http://localhost:8000/cart/items?user_id=${user_id}`)
        .then((res) => res.json());
      setCart(updated);
    } else {
      alert("Failed to remove item from cart.");
    }
  };*/

  /*const removeFromCart = async (product_id, user_id) => {
    const res = await fetch(`http://localhost:8000/cart/remove?user_id=${user_id}&product_id=${product_id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const updatedCart = cart.filter((item) => item.product_id !== product_id);
      setCart(updatedCart);
      alert("Item removed from cart.");
    } else {
      alert("Failed to remove item from cart.");
    }
  };*/

  const removeFromCart = async (product_id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.userid;

    if (!user_id) {
      alert("User not logged in.");
      return;
    }

    const res = await fetch(`http://localhost:8000/cart/remove?user_id=${user_id}&product_id=${product_id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const updatedCart = cart.filter((item) => item.product_id !== product_id);
      setCart(updatedCart);
      alert("Item removed from cart.");
    } else {
      alert("Failed to remove item from cart.");
    }
  };





  const clearCart = async () => {
    const res = await fetch(`http://localhost:8000/cart/clear?user_id=${user_id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setCart([]);
    } else {
      alert("Failed to clear cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

