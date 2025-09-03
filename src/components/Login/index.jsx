import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";  
import { api } from "../../api/api";
import "./index.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/auth/login", "POST", form);
      console.log("Login response:", data);

      Cookies.set("token", data.token, { expires: 7 });

      navigate("/")
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="login-input"
        />
        <button className="login-button">Login</button>
      </form>
      <p className="login-footer">
        Don’t have an account?{" "}
        <Link to="/register" className="login-link">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
