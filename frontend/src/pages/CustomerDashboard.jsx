import React, { useState, useEffect } from 'react';
import '../styles/CustomerDashboard.css';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedDeliveryType, setUpdatedDeliveryType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const customerId = sessionStorage.getItem("customerId");
      if (!customerId) {
        throw new Error("Customer ID not found. Please login again.");
      }

      const response = await fetch(`http://localhost:8080/api/v1/orders/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      // Sort orders by orderTime in descending order
      const sortedOrders = data.sort((a, b) => 
        new Date(b.orderTime) - new Date(a.orderTime)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          address: updatedAddress,
          deliveryType: updatedDeliveryType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Refresh orders after update
      await fetchOrders();
      setEditingOrder(null);
      alert('Order updated successfully!');
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        console.log('Cancelling order:', orderId); // Debug log
        const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to cancel order');
        }

        // Remove the deleted order from state
        setOrders(orders.filter(order => order.id !== orderId));
        alert('Order cancelled successfully!');
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert(err.message);
      }
    }
  };

  const startEditing = (order) => {
    setEditingOrder(order.id);
    setUpdatedAddress(order.address);
    setUpdatedDeliveryType(order.deliveryType);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <i className="fas fa-clock"></i>;
      case 'COMPLETED':
        return <i className="fas fa-check-circle"></i>;
      case 'CANCELLED':
        return <i className="fas fa-times-circle"></i>;
      default:
        return null;
    }
  };

  const handleEditOrder = (order) => {
    if (order.foods && order.foods.length > 0) {
      const restaurantId = order.foods[0].restaurant.id;
      navigate(`/restaurant/${restaurantId}/menu`, {
        state: {
          orderId: order.id,
          orderItems: order.foods,
          address: order.address,
          deliveryType: order.deliveryType
        }
      });
    } else {
      alert('Cannot edit this order: No restaurant information found');
    }
  };

  if (loading) {
    return <div className="dashboard-container"><div className="loading">Loading orders...</div></div>;
  }

  if (error) {
    return <div className="dashboard-container"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="dashboard-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h2>Order #{order.id}</h2>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
              <div className="order-time">
                Ordered on: {formatDate(order.orderTime)}
              </div>
            </div>

            <div className="order-details">
              {editingOrder === order.id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Delivery Address:</label>
                    <textarea
                      value={updatedAddress}
                      onChange={(e) => setUpdatedAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Type:</label>
                    <select
                      value={updatedDeliveryType}
                      onChange={(e) => setUpdatedDeliveryType(e.target.value)}
                      required
                    >
                      <option value="SHIPPING">Delivery</option>
                      <option value="PICKUP">Pickup</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={() => handleUpdateOrder(order.id)}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => setEditingOrder(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="delivery-info">
                    <p><strong>Delivery Type:</strong> {order.deliveryType}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                  </div>

                  <div className="items-list">
                    <h3>Order Items</h3>
                    {order.foods.map((food) => (
                      <div key={food.id} className="food-item">
                        <div className="food-info">
                          <span className="food-name">{food.name}</span>
                          <span className="food-restaurant">{food.restaurant.name}</span>
                        </div>
                        <div className="food-price">₹{food.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="total-amount">
                      <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div className="payment-status">
                      <strong>Payment Status:</strong> {order.paid ? 'Paid' : 'Pending'}
                    </div>
                  </div>

                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    {order.status === 'PENDING' && (
                      <>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditOrder(order)}
                        >
                          <i className="fas fa-edit"></i> Modify Order
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <i className="fas fa-times"></i> Cancel Order
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard; 