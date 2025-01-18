import React, { useState } from 'react';

interface AddClientProps {
  onClientAdded: (client: Client) => void;
}

interface Client {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
}

const AddClient: React.FC<AddClientProps> = ({ onClientAdded }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newClient: Client = { id: Date.now(), name, registrationDate: new Date().toISOString(), email, phone };
    // TODO: here call of API fetch to add new client
    onClientAdded(newClient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button type="submit">Add Client</button>
    </form>
  );
};

export default AddClient;

