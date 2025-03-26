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
        const rawData: Customer[] = await response.json();
        const data: Customer[] = rawData.map((item) => ({
          ...item,
          properties: new Map(Object.entries(item.properties)),
        }));
        setCustomers(data.sort((a, b) => a.id - b.id));
      }
      catch(error) {
        console.error("Error getting customers:", error);
        return null;
      }
    };
    fetchCustomers();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; 
    }
    const day = String(date.getDate()).padStart(2, "0"); 
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

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
        {customer.id} - 
        {customer.name} - 
        {customer.email} - 
        {formatDate(customer.registrationDate)} - 
        {customer.phone} - 
        
         
          {Array.from(customer.properties.entries()).map(([keyAdditional, value]) => (
            
             <label key={"l"+customer.id+keyAdditional}>{keyAdditional}: {String(value)} - </label>
            
          ))}


        
      
        
      
      </li>
    ))}
      </ul>
    </div>
  );
};

export default CustomersList;

