import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';
import { getAllProperties, getInputType, getDefaultValue } from '../../services/propertyTypesService';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface EditCustomerProps {
  onCustomerUpdated: (customer: Customer) => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ onCustomerUpdated }) => {

  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = getToken();
      try {
        const response = await fetch(baseUrl + `/api/customers/${customerId}`, {
          method: 'GET',
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch customer data');
        const data: Customer = await response.json();
        if (data.properties) {
          data.properties = new Map(Object.entries(data.properties));
          console.log(data.properties);
        }
        setCustomer(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }

      setAllProperties(await getAllProperties());

    };
    fetchCustomer();
  }, [customerId]);

  function isProperty(value: unknown): value is Property {
    return (value as Property).id !== undefined;
  }

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>, propertyId: number) => {
    
    const updateProperty = (propertyId: number, newValue: string) => {
      if (!customer) return;  
    
      const updatedProperties = structuredClone(customer.properties);//new Map(Object.entries(customer.properties));
    
      updatedProperties.set(String(propertyId), newValue);
      var updatedCustomer: Customer = structuredClone(customer);
      updatedCustomer.properties = new Map(updatedProperties);
      
      setCustomer(updatedCustomer);

    };

    updateProperty(propertyId, event.target.value);
    
    
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer) return;
    /*const token = getToken();
    try {
      const response = await fetch(`http://localhost:8080/api/customers/${clientId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) throw new Error('Failed to update client');

      const updatedClient: Customer = await response.json();*/
      onCustomerUpdated(customer);
    /*} catch (err) {
      setError((err as Error).message);
    }*/
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <IconButton 
      onClick={() => window.location.href = '/customers'}
      style={{
        position: 'relative', 
        left: '150px',
        top: '-20px',
        cursor: 'pointer',
        fontSize: '24px',
        color: '#757575'
      }}
    ><CloseIcon/>
    </IconButton>
      <div>
        <label>Name</label>
        <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
      </div>
      <div>
        <label>Phone</label>
        <input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
      </div>
      {customer.properties && Object.entries(customer.properties).length > 0 && <h3>Properties</h3>}
      {
        customer.properties ? (
          //Object.entries(customer.properties).map(([key, value]) => (
          [...customer.properties.entries()].map(([key, value]) => (
            <div key={key}>
              <label>{allProperties.find(p=>p.id==Number(key))?.name}&nbsp;</label>
              <input
                type={getInputType(allProperties.find(p=>p.id == Number(key))?.type)}
                value={value?value as string:getDefaultValue(allProperties.find(p=>p.id == Number(key))?.type)} 
                onChange={(e) => handlePropertyChange(e, Number(key))}
              />
            </div>
          ))
        ) : (
          <div></div> 
        )
      }

      <button type="submit">Update Customer</button>
    </form>
  );
};

export default EditCustomer;
