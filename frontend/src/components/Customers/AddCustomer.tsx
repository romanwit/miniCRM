import React, { useEffect, useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';
import { getDefaultValue, getInputType } from '../../services/propertyTypesService';
import FormCloseButton from '../Common/FormCloseButton';

interface AddCustomerProps {
  onCustomerAdded: (customer: NewCustomer, newProperties: Map<string, unknown>) => Promise<void>;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onCustomerAdded }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesValues, setPropertiesValues] = useState<Map<string, unknown>>(new Map<string, unknown>());
  const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);


  useEffect(() => {
    const fetchProperties = async () => {
      const token = getToken();
      try {
        const response = await fetch(baseUrl + "/api/property-types", {
          method: 'GET',
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch property types data');
        const data: Property[] = await response.json();
        setProperties(data);
        var updatedPropertiesValues = structuredClone(propertiesValues);
        data.forEach(d=>{
          updatedPropertiesValues.set(String(d.id), getDefaultValue(d.type));
        })
        setPropertiesValues(updatedPropertiesValues);
      } catch (err) {
        alert('!')
      } 

    };
    fetchProperties();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCustomer: NewCustomer = {
      name, 
      registrationDate: new Date().toISOString(), 
      email, 
      phone,
      properties: propertiesValues
    };

    try {
      await onCustomerAdded(newCustomer, propertiesValues);
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

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>, propertyId: number) => {
      
      const updateProperty = (propertyId: number, newValue: string) => { 
      
        const updatedPropertiesValues = structuredClone(propertiesValues);
      
        updatedPropertiesValues.set(String(propertyId), newValue);
        
        setPropertiesValues(updatedPropertiesValues);
  
      };
  
      updateProperty(propertyId, event.target.value);
      
      console.log(propertiesValues);
      
    };

  return (
    <>
    <FormCloseButton path='/customers'/>
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
      {properties && Object.entries(properties).length > 0 && <h3>Properties</h3>}
          <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
            {
              properties ? (
                [...properties.entries()].map(([key, value]) => (
                  <div key={key}>
                    <label>{value.name}&nbsp;</label>
                    <input
                      type={getInputType(value.type)}
                      value = {String(propertiesValues.get(String(value.id)))} 
                      onChange={(e) => handlePropertyChange(e, Number(value.id))}
                    />
                  </div>
                ))
              ) : (
                <div></div> 
              )
            }
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

