import React, { useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../SnackBarComponent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface AddCustomerProps {
  onCustomerAdded: (customer: NewCustomer) => Promise<void>;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onCustomerAdded }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCustomer: NewCustomer = {
      name, 
      registrationDate: new Date().toISOString(), 
      email, 
      phone,
      properties: new Map<string, unknown>()
    };

    try {
      await onCustomerAdded(newCustomer);
    } catch(error) {
      setSnackBar({ 
        message: error instanceof Error ? error.message : 'Error adding customer', 
        severity: 'error' 
      });
    }
  };

  const handleSnackBarClose = () => {
    setSnackBar(null);
  };

  return (
    <>
    <IconButton 
      onClick={() => window.location.href = '/customers'}
      style={{
        position: 'relative', 
        left: '320px',
        top: '40px',
        cursor: 'pointer',
        fontSize: '24px',
        color: '#757575'
      }}
    ><CloseIcon/>
    </IconButton>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>&nbsp;
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>&nbsp;
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone</label>&nbsp;
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button type="submit">Add Customer</button>
    </form>
    {snackBar && (
        <SnackBarComponent
          message={snackBar.message}
          severity={snackBar.severity}
          duration={4000}
          onClose={handleSnackBarClose}
        />
      )}
    </>
  );
};

export default AddCustomer;

