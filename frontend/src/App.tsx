import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Clients/LoginPage';
import RegisterPage from './components/Clients/RegisterPage';
import ClientsList from './components/Clients/ClientsList';
import AddClient from './components/Clients/AddClient';
import EditClient from './components/Clients/EditClient';
import AdminDashboard from './components/Admin/AdminDashboard';
import { handleLogin, handleRegister } from "./services/authService";
import { handleClientAdded, handleClientUpdated } from "./services/clientService";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister}/>} />
        <Route path="/customers" element={<ClientsList />} />
        <Route path="/customers/add" element={<AddClient onClientAdded={handleClientAdded}/>} />
        <Route path="/customers/edit/:id" element={<EditClient onClientUpdated={handleClientUpdated}/>} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

