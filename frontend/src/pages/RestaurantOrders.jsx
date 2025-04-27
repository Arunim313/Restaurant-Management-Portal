import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/RestaurantOrders.css";
import axios from "axios";

const RestaurantOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/orders/restaurant/${id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-orders-container">
      <div className="orders-header">
        <h2>Restaurant Orders</h2>
        <div className="orders-summary">
          <div className="summary-card">
            <span className="summary-title">Total Orders</span>
            <span className="summary-value">{orders.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-title">Pending Orders</span>
            <span className="summary-value">{orders.filter(order => order.status === 'PENDING').length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-title">Completed Orders</span>
            <span className="summary-value">{orders.filter(order => order.status === 'COMPLETED').length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-title">Total Revenue</span>
            <span className="summary-value">₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No Orders Found</h3>
          <p>There are currently no orders for your restaurant.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-id">Order #{order.id}</div>
                <div className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-content">
                <div className="order-section customer-section">
                  <h4>Customer Details</h4>
                  <p><strong>{order.customer.firstname} {order.customer.lastname}</strong></p>
                  <p>{order.customer.phoneNumber}</p>
                  <p className="delivery-address">Delivery to: {order.address}</p>
                </div>

                <div className="order-section items-section">
                  <h4>Order Items</h4>
                  {order.foods.map((food) => (
                    <div key={food.id} className="food-item">
                      <div className="food-item-info">
                        <span className="food-name">{food.name}</span>
                        {food.vegetarian && <span className="veg-badge">VEG</span>}
                      </div>
                      <span className="food-price">₹{food.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-section total-section">
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="meta-item">
                    <span>Delivery: {order.deliveryType}</span>
                  </div>
                  <div className="meta-item">
                    <span>Ordered: {new Date(order.orderTime).toLocaleString()}</span>
                  </div>
                  <div className="meta-item">
                    <span>Payment: {order.paid ? 'Paid' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders; 