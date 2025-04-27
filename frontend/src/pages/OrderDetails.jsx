import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/OrderDetails.css';
import PaymentComponent from '../components/PaymentComponent';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return <div className="order-details-container"><div className="loading">Loading order details...</div></div>;
  if (error) return <div className="order-details-container"><div className="error-message">{error}</div></div>;
  if (!order) return <div className="order-details-container"><div className="error-message">Order not found</div></div>;

  return (
    <div className="order-details-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <div className="order-details-card">
        <div className="order-header">
          <div className="order-title">
            <h1>Order Details #{order.id}</h1>
            <span className={`order-status ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="order-time">
            Ordered on: {formatDate(order.orderTime)}
          </div>
        </div>

        <div className="details-section">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{`${order.customer.firstname} ${order.customer.lastname}`}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{order.customer.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{order.customer.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2>Delivery Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Delivery Type:</label>
              <span>{order.deliveryType}</span>
            </div>
            <div className="info-item">
              <label>Delivery Address:</label>
              <span>{order.address}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2>Order Items</h2>
          <div className="food-items-list">
            {order.foods.map((food) => (
              <div key={food.id} className="food-item-detailed">
                <div className="food-main-info">
                  <h3>{food.name}</h3>
                  <p className="food-description">{food.description}</p>
                  <span className="food-category">{food.category}</span>
                  <span className={`food-type ${food.vegetarian ? 'veg' : 'non-veg'}`}>
                    {food.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>
                <div className="food-restaurant-info">
                  <h4>{food.restaurant.name}</h4>
                  <p>{food.restaurant.address}</p>
                  <p>{food.restaurant.phoneNumber}</p>
                </div>
                <div className="food-price">₹{food.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <label>Total Amount:</label>
            <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <label>Payment Status:</label>
            <span className={`payment-status ${order.paid ? 'paid' : 'pending'}`}>
              {order.paid ? 'Paid' : 'Payment Pending'}
            </span>
          </div>
        </div>

        {!order.paid && (
          <PaymentComponent 
            orderId={order.id} 
            totalAmount={order.totalAmount} 
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetails; 