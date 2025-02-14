import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';

interface EditCustomerProps {
  onCustomerUpdated: (customer: Customer) => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ onCustomerUpdated }) => {

  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const [client, setClient] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      const token = getToken();
      try {
        const response = await fetch(`http://localhost:8080/api/customers/${clientId}`, {
          method: 'GET',
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch customer data');
        const data: Customer = await response.json();
        setClient(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>, propertyId: number) => {
    if (!client) return;
    const updatedProperties = client.properties.map((prop) =>
      prop.id === propertyId ? { ...prop, value: event.target.value } : prop
    );
    setClient({ ...client, properties: updatedProperties });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) return;
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
      onCustomerUpdated(client);
    /*} catch (err) {
      setError((err as Error).message);
    }*/
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!client) return <div>Customer not found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
      </div>
      <div>
        <label>Phone</label>
        <input type="tel" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
      </div>
      <h3>Properties</h3>
      {client.properties?.map((prop) => (
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
