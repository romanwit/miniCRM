import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Customers/LoginPage';
import RegisterPage from './components/Customers/RegisterPage';
import CustomersList from './components/Customers/CustomersList';
import AddCustomer from './components/Customers/AddCustomer';
import EditCustomer from './components/Customers/EditCustomer';
import AdminDashboard from './components/Admin/AdminDashboard';
import { handleLogin, handleRegister } from "./services/authService";
import { handleCustomerAdded, handleCustomerUpdated } from "./services/customerService";
import './css/Forms.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister}/>} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/customers/add" element={<AddCustomer onCustomerAdded={handleCustomerAdded}/>} />
        <Route path="/customers/edit/:id" element={<EditCustomer onCustomerUpdated={handleCustomerUpdated}/>} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

