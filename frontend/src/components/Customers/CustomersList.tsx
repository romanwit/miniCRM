import React, { useState, useEffect } from 'react';
import { getRole } from '../../services/authService';

const role = getRole();

interface CustomersListProps {
  onGetCustomersList: () => Promise<{properties: Property[], customers: Customer[]}>;
}

const CustomersList: React.FC<CustomersListProps> = ({onGetCustomersList}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { customers, properties } = await onGetCustomersList();
        setCustomers(customers);
        setProperties(properties);
      } catch (error) {
        console.error('Err:', error);
        alert(error);
      }
    };
  
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
    <div className="table-container">
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

