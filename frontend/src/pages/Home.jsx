import React from "react";
import "../styles/Home.css"; // Import CSS file
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1>Welcome to Foodie Hub</h1>
        <p className="tagline">Discover the finest cuisines, delivered to your doorstep</p>
        <div className="features">
          <div className="feature">
            <i className="fas fa-utensils"></i>
            <span>Premium Restaurants</span>
          </div>
          <div className="feature">
            <i className="fas fa-truck"></i>
            <span>Fast Delivery</span>
          </div>
          <div className="feature">
            <i className="fas fa-star"></i>
            <span>Best Deals</span>
          </div>
        </div>
        <div className="auth-buttons">
          <div className="button-group">
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/signup" className="btn login-btn">SignUp</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;