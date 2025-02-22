import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';

const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = getToken();
      try {
        const response = await fetch(baseUrl + '/api/customers', 
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
        //console.log(data[0].properties.get);
        setCustomers(data);
      }
      catch(error) {
        console.error("Error getting customers:", error);
        return null;
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customers List</h2>
      <button onClick={() => window.location.href = '/customers/add'}>Add customer</button> 
      <ul>
      {customers.map((customer) => (
      <li
        key={customer.id}
        onDoubleClick={() => window.location.href = `/customers/edit/${customer.id}`} 
      >
        {customer.name} - {customer.email}
      </li>
    ))}
      </ul>
    </div>
  );
};

export default CustomersList;

