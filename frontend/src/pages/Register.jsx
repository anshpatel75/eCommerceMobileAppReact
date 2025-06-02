import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../app.css";
import "../styles/Auth.css";
import InputField from "../components/InputField";

const Register = () => {
  const [form, setForm] = useState({ userid: "", password: "", role: "user" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      setMessage("User registered successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <InputField
          name="userid"
          placeholder="User ID"
          onChange={handleChange}
          required
        />

        <InputField
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
