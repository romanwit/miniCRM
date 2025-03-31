import React, { useState, useEffect } from 'react';
import { getToken, getRole } from '../../services/authService';
import { baseUrl } from '../../services/constService';

const role = getRole();

const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const token = getToken();
    const fetchPropertyTypes = async () => {
      try {
        const response = await fetch(baseUrl + '/api/property-types', 
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProperties(data);
      }
      catch(error) {
        console.error("Error getting properties:", error);
        return null;
      }
    }

    const fetchCustomers = async () => {
      
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
    const fetchData = async () => {
      try {
        await fetchPropertyTypes();
        await fetchCustomers();
      } catch(error) {
        console.error("Error getting data ", error);
      }
    }
    fetchData();
  }, []);

  function getPropertyName(id: number) {
    return properties.filter(item => item.id === id)[0]?.name;  
  }

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
      {role === 'ROLE_ADMIN' && (
        <div style={{position: 'fixed',
                top: '10px',
                width: '50%',
                textAlign: 'right'}}>
          <button 
            onClick={() => window.location.href = '/admin'}
          >Admin dashboard</button>
        </div>
      )}
      <h2>Customers List</h2>
      <button onClick={() => window.location.href = '/customers/add'}>Add customer</button> 
      <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Registration Date</th>
        <th>Phone</th>
        {customers.length > 0 && 
          Array.from(customers[0].properties.keys()).map((key) => (
            <th key={key}>{getPropertyName(parseInt(key))}</th>
          ))}
      </tr>
    </thead>
    <tbody>
      {customers.map((customer) => (
      <tr
        key={customer.id}
        onDoubleClick={() => window.location.href = `/customers/edit/${customer.id}`} 
      >
        <td>{customer.id}</td>
        <td>{customer.name}</td> 
        <td>{customer.email}</td>
        <td>{formatDate(customer.registrationDate)}</td> 
        <td>{customer.phone}</td>
        
         
          {Array.from(customer.properties.entries()).map(([keyAdditional, value]) => (
            
             <td key={"td"+customer.id+keyAdditional}>{value?.toString() ?? ""}</td>
            
          ))}

      </tr>
    ))}
      </tbody>
      </table>
    </div>
  );
};

export default CustomersList;

