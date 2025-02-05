import React, { useState, useEffect } from 'react';

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("auth_token_xyz") || "";
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
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.name} - {client.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsList;

