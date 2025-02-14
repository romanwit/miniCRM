import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/authService';

const CustomersList: React.FC = () => {
  const [clients, setClients] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const token = getToken();
      try {
        const response = await fetch('http://localhost:8080/api/customers', 
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: Customer[] = await response.json();
        setClients(data);
      }
      catch(error) {
        console.error("Error getting customers:", error);
        return null;
      }
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h2>Customers List</h2>
      <button onClick={() => window.location.href = '/customers/add'}>Add Client</button> 
      <ul>
      {clients.map((client) => (
      <li
        key={client.id}
        onDoubleClick={() => window.location.href = `/customers/edit/${client.id}`} 
      >
        {client.name} - {client.email}
      </li>
    ))}
      </ul>
    </div>
  );
};

export default CustomersList;

