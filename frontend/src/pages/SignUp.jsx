import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('role'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER" // This will be set based on initial selection
  });

  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    description: "",
    address: "",
    district: "",
    phoneNumber: "",
  });

  const handleRoleSelection = (role) => {
    setUserDetails(prev => ({ ...prev, role }));
    setStep('userDetails');
  };

  const handleUserDetailsChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleRestaurantDetailsChange = (e) => {
    setRestaurantDetails({
      ...restaurantDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Email validation
    if (!userDetails.email.includes('@')) {
      setError("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    // Password validation
    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = userDetails;

      const response = await fetch('http://localhost:8080/api/v1/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      // Check if response has content
      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") 
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Signup failed');
      }

      // For both customers and owners, redirect to login after successful signup
      alert('Registration successful! Please login to continue.');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const ownerId = sessionStorage.getItem('ownerId');
      if (!ownerId) {
        throw new Error('Owner ID not found');
      }

      const restaurantData = {
        ...restaurantDetails,
        ownerId: parseInt(ownerId)
      };

      const response = await fetch('http://localhost:8080/api/v1/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData)
      });

      const contentType = response.headers.get("content-type");
      const data = contentType && contentType.includes("application/json") 
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Restaurant registration failed');
      }

      // Show success message using alert
      alert('Restaurant registration successful! Please login to continue.');
      
      // Clear owner ID from session storage
      sessionStorage.removeItem('ownerId');
      
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Restaurant registration error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this validation function
  const validateForm = () => {
    if (!userDetails.firstname || !userDetails.lastname || !userDetails.email || 
        !userDetails.address || !userDetails.phoneNumber || !userDetails.password) {
      setError("All fields are required!");
      return false;
    }

    if (!userDetails.email.includes('@')) {
      setError("Please enter a valid email address!");
      return false;
    }

    if (userDetails.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return false;
    }

    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }

    return true;
  };

  // Update the form submission to use validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await handleUserSignup(e);
  };

  // Role Selection Screen
  if (step === 'role') {
    return (
      <div className="signup-container">
        <div className="signup-card role-selection">
          <h1>Sign Up As</h1>
          <div className="role-buttons">
            <button 
              className="role-button customer"
              onClick={() => handleRoleSelection("CUSTOMER")}
            >
              <i className="fas fa-user"></i>
              <h2>Customer</h2>
              <p>Order food from restaurants</p>
            </button>
            <button 
              className="role-button owner"
              onClick={() => handleRoleSelection("OWNER")}
            >
              <i className="fas fa-store"></i>
              <h2>Restaurant Owner</h2>
              <p>Register your restaurant</p>
            </button>
          </div>
          <div className="login-link">
            Already have an account? <a onClick={() => navigate("/login")}>Login</a>
          </div>
        </div>
      </div>
    );
  }

  // Restaurant Details Form
  if (step === 'restaurantDetails') {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <h1>Register Your Restaurant</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleRestaurantRegistration}>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={restaurantDetails.name}
                onChange={handleRestaurantDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={restaurantDetails.description}
                onChange={handleRestaurantDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={restaurantDetails.address}
                onChange={handleRestaurantDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={restaurantDetails.district}
                onChange={handleRestaurantDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={restaurantDetails.phoneNumber}
                onChange={handleRestaurantDetailsChange}
                required
              />
            </div>

            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Restaurant"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // User Details Form
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Your Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              value={userDetails.firstname}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              value={userDetails.lastname}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userDetails.address}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={userDetails.password}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userDetails.confirmPassword}
              onChange={handleUserDetailsChange}
              required
            />
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 