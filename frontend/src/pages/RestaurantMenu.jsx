import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/RestaurantMenu.css';

const RestaurantMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    deliveryType: 'SHIPPING'
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isModifying = location.state?.orderId;
  const customerRole = sessionStorage.getItem("customerRole");
  const isOwner = customerRole === "OWNER";

  useEffect(() => {
    fetchMenu();
    // If modifying an order, initialize cart with existing order items
    if (isModifying && location.state?.orderItems) {
      setCart(location.state.orderItems);
      setOrderDetails({
        address: location.state.address || '',
        deliveryType: location.state.deliveryType || 'SHIPPING'
      });
    }
  }, [id]);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/food/restaurant/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch menu');

      const data = await response.json();
      setMenu(data);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (foodItem) => {
    setCart([...cart, foodItem]);
  };

  const removeFromCart = (foodId) => {
    setCart(cart.filter(item => item.id !== foodId));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerId = sessionStorage.getItem("customerId");
      if (!customerId) {
        throw new Error("Customer ID not found. Please login again.");
      }

      // Check for pending orders
      const pendingOrdersResponse = await fetch(`http://localhost:8080/api/v1/orders/customer/${customerId}/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (pendingOrdersResponse.ok) {
        const pendingOrders = await pendingOrdersResponse.json();
        if (pendingOrders.length > 0 && !isModifying) {
          alert('Please complete your pending order before placing a new one.');
          navigate('/dashboard');
          return;
        }
      }

      const orderData = {
        customer: { id: parseInt(customerId, 10) },
        foods: cart.map(item => ({ id: item.id })),
        address: orderDetails.address,
        deliveryType: orderDetails.deliveryType
      };

      const url = isModifying 
        ? `http://localhost:8080/api/v1/orders/${location.state.orderId}`
        : 'http://localhost:8080/api/v1/orders';

      const method = isModifying ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isModifying ? 'Failed to modify order' : 'Failed to place order'));
      }

      // Don't try to parse response as JSON since the server returns void
      setCart([]);
      setShowOrderForm(false);
      alert(isModifying ? 'Order modified successfully!' : 'Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error with order:', err);
      alert(err.message);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/food/${foodId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        // Check if it's a foreign key constraint error
        if (response.status === 500) {
          throw new Error(
            "This food item cannot be deleted because it is part of existing orders. "
          );
        }
        throw new Error("Failed to delete food item");
      }
      
      fetchMenu();
    } catch (err) {
      alert(err.message); // Changed from setError to alert for better visibility
      console.error('Error deleting food:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container">
      <h1>{isModifying ? 'Modify Order' : 'Restaurant Menu'}</h1>
      
      {isOwner && (
        <div className="owner-actions">
          <button 
            className="add-food-button"
            onClick={() => navigate(`/restaurant/${id}/add-food`)}
          >
            Add New Food Item
          </button>
          <button 
            className="check-orders-button"
            onClick={() => navigate(`/restaurant/${id}/orders`)}
          >
            Check Orders
          </button>
        </div>
      )}

      {/* Cart Summary - Moved to center */}
      {!isOwner && cart.length > 0 && (
        <div className="cart-overlay">
          <div className="cart-summary">
            <h2>Your Cart</h2>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button 
              className="place-order-btn"
              onClick={() => setShowOrderForm(true)}
            >
              {isModifying ? 'Update Order' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h2>{isModifying ? 'Update Your Order' : 'Complete Your Order'}</h2>
            <form onSubmit={handleOrderSubmit}>
              <div className="form-group">
                <label>Delivery Address:</label>
                <textarea
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    address: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Delivery Type:</label>
                <select
                  value={orderDetails.deliveryType}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    deliveryType: e.target.value
                  })}
                  required
                >
                  <option value="SHIPPING">Delivery</option>
                  <option value="PICKUP">Pickup</option>
                </select>
              </div>
              <div className="order-actions">
                <button type="submit" className="confirm-order-btn">
                  {isModifying ? 'Update Order' : 'Confirm Order'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowOrderForm(false)}
                >
                  Cancel Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="menu-grid">
        {menu.map((food) => (
          <div key={food.id} className="food-card">
            <div className="food-info">
              <h2>{food.name}</h2>
              <p className="description">{food.description}</p>
              <p className="category">{food.category}</p>
              <p className="price">₹{food.price.toFixed(2)}</p>
              <span className={`veg-badge ${food.vegetarian ? 'veg' : 'non-veg'}`}>
                {food.vegetarian ? '🥬 Vegetarian' : '🍖 Non-Vegetarian'}
              </span>
            </div>
            
            {isOwner ? (
              <div className="food-actions">
                <button 
                  className="edit-button"
                  onClick={() => navigate(`/restaurant/${id}/food/${food.id}/edit`, { 
                    state: { food } 
                  })}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteFood(food.id)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="food-actions">
                {cart.some(item => item.id === food.id) ? (
                  <button 
                    className="remove-from-cart-btn"
                    onClick={() => removeFromCart(food.id)}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(food)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu; 