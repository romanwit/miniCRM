import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';

interface EditCustomerProps {
  onCustomerUpdated: (customer: Customer) => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ onCustomerUpdated }) => {

  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = getToken();
      try {
        const response = await fetch(`http://localhost:8080/api/customers/${customerId}`, {
          method: 'GET',
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch customer data');
        const data: Customer = await response.json();
        setCustomer(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>, propertyId: number) => {
    if (!customer) return;
    const updatedProperties = customer.properties.map((prop) =>
      prop.id === propertyId ? { ...prop, value: event.target.value } : prop
    );
    setCustomer({ ...customer, properties: updatedProperties });
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
      <h3>Properties</h3>
      {customer.properties?.map((prop) => (
        <div key={prop.id}>
          <label>{prop.type}</label>
          <input type="text" value={prop.value} onChange={(e) => handlePropertyChange(e, prop.id)} />
        </div>
      ))??[]}
      <button type="submit">Update Customer</button>
    </form>
  );
};

export default EditCustomer;
