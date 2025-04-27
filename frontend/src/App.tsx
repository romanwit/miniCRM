import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Users/LoginPage';
import CustomersList from './components/Customers/CustomersList';
import AddCustomer from './components/Customers/AddCustomer';
import EditCustomer from './components/Customers/EditCustomer';
import AdminDashboard from './components/Admin/AdminDashboard';
import { handleCreateUser, handleLogin, handleEditUser } from "./services/authService";
import { handleCustomerAdded, handleCustomerUpdated, handleGetCustomersList } from "./services/customerService";
import './css/Forms.css';
import './css/Tables.css';
import AddAdditionalProperty from './components/AdditionalProperties/AddAdditionalProperty';
import EditAdditionalProperty from './components/AdditionalProperties/EditAdditionalProperty';
import { handleAdditionalPropertyAdded, handleAdditionalPropertyEdited, handleGetAdditionalProperty } from './services/propertyTypesService';
import AddUser from './components/Users/AddUser';
import EditUser from './components/Users/EditUser';
import { handleGetFixedValuesList, handleFixedListValuesEdited } from './services/fixedListValuesService';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route path="/customers" element={<CustomersList onGetCustomersList={handleGetCustomersList} />} />
        <Route path="/customers/add" element={<AddCustomer onCustomerAdded={handleCustomerAdded}/>} />
        <Route path="/customers/edit/:id" element={<EditCustomer onCustomerUpdated={handleCustomerUpdated}/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/addAdditionalProperty" element={<AddAdditionalProperty onAdditionalPropertyAdded={handleAdditionalPropertyAdded} />} />
        <Route path="/admin/editAdditionalProperty/:id" element={<EditAdditionalProperty 
          onGetAdditionalProperty={handleGetAdditionalProperty}
          onAdditionalPropertyEdited={handleAdditionalPropertyEdited}
          onGetFixedValuesList={handleGetFixedValuesList} 
          onSaveFixedValuesList={handleFixedListValuesEdited}/>}></Route>
        <Route path="/admin/addUser" element={<AddUser onUserAdded={handleCreateUser} />} />
        <Route path="/admin/editUser/:id" element={<EditUser onUserEdited={handleEditUser} />} />
      </Routes>
    </Router>
  );
};

export default App;

