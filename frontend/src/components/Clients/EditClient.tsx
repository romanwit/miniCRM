import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Property[];
}

interface Property {
  id: number;
  type: string;
  value: string;
}

interface EditClientProps {
  onClientUpdated: (client: Client) => void;
}

const EditClient: React.FC<EditClientProps> = ({ onClientUpdated }) => {

  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) throw new Error('Failed to fetch client data');
        const data: Client = await response.json();
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

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });

      if (!response.ok) throw new Error('Failed to update client');

      const updatedClient: Client = await response.json();
      onClientUpdated(updatedClient);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!client) return <div>Client not found</div>;

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
      {client.properties.map((prop) => (
        <div key={prop.id}>
          <label>{prop.type}</label>
          <input type="text" value={prop.value} onChange={(e) => handlePropertyChange(e, prop.id)} />
        </div>
      ))}
      <button type="submit">Update Client</button>
    </form>
  );
};

export default EditClient;
