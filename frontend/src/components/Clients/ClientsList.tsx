import React, { useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  registrationDate: string; // TODO: change type to date
  email: string;
  phone: string;
}

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch('/api/clients');
      const data: Client[] = await response.json();
      setClients(data);
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h2>Clients List</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>{client.name} - {client.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsList;

