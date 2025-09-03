import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/api";
import "./index.css"; // 👈 Import the CSS

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/auth/register", "POST", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="register-input"
        />
        <button className="register-button">Register</button>
      </form>
      <p className="register-footer">
        Already have an account?{" "}
        <Link to="/login" className="register-link">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
