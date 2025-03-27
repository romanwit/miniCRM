import React, { useState } from 'react';

interface AddCustomerProps {
  onCustomerAdded: (customer: NewCustomer) => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onCustomerAdded }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCustomer: NewCustomer = {
      //id: Date.now(), 
      name, 
      registrationDate: new Date().toISOString(), 
      email, 
      phone,
      properties: new Map<string, unknown>()
    };
    onCustomerAdded(newCustomer);
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
      <button type="submit">Add Customer</button>
    </form>
  );
};

export default AddCustomer;

