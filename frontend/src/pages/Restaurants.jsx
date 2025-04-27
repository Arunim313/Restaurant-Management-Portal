import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: ownerId } = useParams();
  const navigate = useNavigate();
  const customerRole = sessionStorage.getItem('customerRole');
  const isOwner = customerRole === 'OWNER';

  useEffect(() => {
    fetchRestaurants();
  }, [ownerId]);

  const fetchRestaurants = async () => {
    try {
      const url = isOwner && ownerId
        ? `http://localhost:8080/api/v1/restaurants/owner/${ownerId}`
        : 'http://localhost:8080/api/v1/restaurants';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      console.log(data);
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMenu = async (restaurantId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/food/restaurant/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      const menuData = await response.json();
      navigate(`/restaurant/${restaurantId}/menu`, { state: { menu: menuData } });
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err.message);
    }
  };

  const handleUpdateRestaurant = (restaurant) => {
    navigate(`/update-restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  if (loading) {
    return (
      <div className="restaurants-container">
        <div className="loading">
          <i className="fas fa-utensils fa-spin"></i>
          <span>Loading restaurants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurants-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="restaurants-container">
      <h1>{isOwner ? 'My Restaurants' : 'All Restaurants'}</h1>
      
      {isOwner && (
        <div className="owner-actions">
          <button 
            className="add-restaurant-button"
            onClick={() => navigate('/add-restaurant')}
          >
            Add New Restaurant
          </button>
        </div>
      )}

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="restaurant-info">
              <h2>{restaurant.name}</h2>
              <p className="description">{restaurant.description}</p>
              <p className="address">📍 {restaurant.address}</p>
              <p className="district">🏢 {restaurant.district}</p>
              <p className="phone">📞 {restaurant.phoneNumber}</p>
            </div>
            
            <div className="restaurant-actions">
              <button 
                className="view-menu-button"
                onClick={() => navigate(`/restaurant/${restaurant.id}/menu`)}
              >
                View Menu
              </button>
              
              {isOwner && (
                <>
                  <button 
                    className="check-orders-button"
                    onClick={() => navigate(`/restaurant/${restaurant.id}/orders`)}
                  >
                    Check Orders
                  </button>
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/update-restaurant/${restaurant.id}`)}
                  >
                    Edit Details
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants; 