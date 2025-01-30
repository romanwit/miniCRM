import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Clients/LoginPage';
import RegisterPage from './components/Clients/RegisterPage';
import ClientsList from './components/Clients/ClientsList';
import AddClient from './components/Clients/AddClient';
import EditClient from './components/Clients/EditClient';
import AdminDashboard from './components/Admin/AdminDashboard';

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); 
      console.log("Success, token:", data.token);
      
      window.location.href = "/dashboard";  
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(`Login error: ${error.message}`);
    } else {
      alert("Unknown login error");
    }
  }
};

const handleRegister = async (username: string, password: string, email: string) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    
    if (response.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = "/login"; 
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred. Please try again.');
  }
};

const handleClientAdded = async (newClient: Client) => {

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error('Failed to add client');
      }

      const savedClient = await response.json(); 
      //onClientAdded(savedClient); 
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client. Please try again.');
    } finally {
      //setLoading(false);
    }
}

const handleClientUpdated = async (client: Client) => {
  try {
    const response = await fetch(`/api/clients/${client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Failed to update client: ${response.statusText}`);
    }

    const updatedClient = await response.json();
    console.log('Client updated successfully:', updatedClient);
    alert('Client updated successfully!');
  } catch (error) {
    console.error('Error updating client:', error);
    alert(`Error updating client: ${(error as Error).message}`);
  }
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister}/>} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/add" element={<AddClient onClientAdded={handleClientAdded}/>} />
        <Route path="/clients/edit/:id" element={<EditClient onClientUpdated={handleClientUpdated}/>} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

