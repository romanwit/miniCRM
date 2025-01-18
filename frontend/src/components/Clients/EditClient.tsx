import React, { useState, useEffect } from 'react';

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
  clientId: number;
  onClientUpdated: (client: Client) => void;
}

const EditClient: React.FC<EditClientProps> = ({ clientId, onClientUpdated }) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      const response = await fetch(`/api/clients/${clientId}`);
      const data: Client = await response.json();
      setClient(data);
    };
    fetchClient();
  }, [clientId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, propertyId: number) => {
    // TODO: add handling of changing client here 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (client) {
      // TODO: add here API fetch call to change client
      onClientUpdated(client);
    }
  };

  if (!client) return <div>Loading...</div>;

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
      {/* Дополнительные поля для редактирования свойств клиента */}
      <button type="submit">Update Client</button>
    </form>
  );
};

export default EditClient;

