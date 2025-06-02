import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>eCommerce App</h1>
      <nav className="nav-links">
        {!isAdmin && currentPath !== "/" && <Link to="/">Home</Link>}
        {!isAdmin && currentPath !== "/cart" && <Link to="/cart">Cart</Link>}

        {isLoggedIn && !isAdmin && currentPath !== "/orders/history" && (
          <Link to="/orders/history">Orders</Link>
        )}

        {!isLoggedIn && currentPath === "/" && <Link to="/login">Login</Link>}

        {isLoggedIn && (
          <span
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "white", textDecoration: "none", marginLeft: "15px" }}
          >
            Logout
          </span>
        )}
      </nav>
    </header>
  );
};

export default Header;
