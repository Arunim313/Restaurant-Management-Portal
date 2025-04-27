import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        sessionStorage.setItem("customerId", data.customer.id);
        sessionStorage.setItem("customerName", `${data.customer.firstname} ${data.customer.lastname}`);
        sessionStorage.setItem("customerRole", data.customer.role);

        if (data.customer.role === "OWNER") {
          // For owners, fetch their restaurants first
          const ownerRestaurantsUrl = `http://localhost:8080/api/v1/restaurants/owner/${data.customer.id}`;
          console.log("Fetching owner restaurants from:", ownerRestaurantsUrl);

          const restaurantsResponse = await fetch(ownerRestaurantsUrl);
          
          if (!restaurantsResponse.ok) {
            throw new Error("Failed to fetch owner's restaurants");
          }

          const restaurantsData = await restaurantsResponse.json();
          console.log("Owner restaurants data:", restaurantsData);

          // Store restaurants data
          sessionStorage.setItem("ownerRestaurants", JSON.stringify(restaurantsData));
          
          // Navigate to owner's restaurants page
          navigate(`/restaurants/owner/${data.customer.id}`);
        } else {
          // For customers, redirect to main restaurants page
          navigate("/restaurants");
        }
      } else {
        // Display the error message from the backend
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Only show network error if we can't connect to the server
      if (err.message.includes("Failed to fetch")) {
        setError("Network error or server is not responding");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <a onClick={() => navigate("/signup")}>Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 