import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const customerRole = sessionStorage.getItem("customerRole");
  const customerId = sessionStorage.getItem("customerId");
  const isOwner = customerRole === "OWNER";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const goToDashboard = () => {
    if (isOwner) {
      // For owner, go to their restaurants list
      navigate(`/restaurants/owner/${customerId}`);
    } else {
      // For customer, go to their order history
      navigate('/dashboard');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        Food Delivery
      </div>
      
      <div className="nav-links">
        <button className="nav-button" onClick={() => navigate('/restaurants')}>
          Restaurants
        </button>
        
        <button className="nav-button" onClick={goToDashboard}>
          {isOwner ? 'My Restaurants' : 'My Orders'}
        </button>
        
        <button className="nav-button logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 