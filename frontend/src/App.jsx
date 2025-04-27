import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import CustomerDashboard from "./pages/CustomerDashboard";
import OrderDetails from "./pages/OrderDetails";
import SignUp from "./pages/SignUp";
import AddRestaurant from "./pages/AddRestaurant";
import UpdateRestaurant from "./pages/UpdateRestaurant";
import AddFood from "./pages/AddFood";
import UpdateFood from "./pages/UpdateFood";
import RestaurantOrders from "./pages/RestaurantOrders";
import './styles/common.css';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      {!isHomePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/owner/:id" element={<Restaurants />} />
        <Route path="/restaurant/:id/menu" element={<RestaurantMenu />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/update-restaurant/:id" element={<UpdateRestaurant />} />
        <Route path="/restaurant/:id/add-food" element={<AddFood />} />
        <Route path="/restaurant/:id/food/:foodId/edit" element={<UpdateFood />} />
        <Route path="/restaurant/:id/orders" element={<RestaurantOrders />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

