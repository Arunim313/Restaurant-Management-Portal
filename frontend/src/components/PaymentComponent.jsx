import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentComponent.css';

const PaymentComponent = ({ orderId, totalAmount }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // First, process the payment
            const paymentResponse = await fetch('http://localhost:8080/api/v1/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    order: {
                        id: orderId
                    },
                    paymentMethod: paymentMethod,
                    paymentStatus: 'PAID'  // Explicitly set payment status to PAID
                })
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.message || 'Payment failed');
            }

            // Then, update the order status to COMPLETED
            const orderResponse = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                    paid: true
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to update order status');
            }

            navigate('/dashboard', { state: { message: 'Payment successful! Your order has been completed.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>Complete Your Payment</h2>
            
            <div className="payment-details">
                <p>Order ID: {orderId}</p>
                <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="payment-options">
                <div className="payment-option">
                    <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="CASH"
                        checked={paymentMethod === 'CASH'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="cash">
                        <i className="fas fa-money-bill-wave"></i>
                        Cash on Delivery
                    </label>
                </div>

                <div className="payment-option">
                    <input
                        type="radio"
                        id="wallet"
                        name="paymentMethod"
                        value="WALLET"
                        checked={paymentMethod === 'WALLET'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="wallet">
                        <i className="fas fa-wallet"></i>
                        Wallet Payment
                    </label>
                </div>
            </div>

            <button
                className="payment-button"
                onClick={handlePayment}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>
        </div>
    );
};

export default PaymentComponent; 