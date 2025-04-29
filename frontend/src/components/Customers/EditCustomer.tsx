import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';
import { getAllProperties, getInputType, getDefaultValue } from '../../services/propertyTypesService';
import FormCloseButton from '../Common/FormCloseButton';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import { AlertColor } from '@mui/material';
import { handleGetFixedValuesList } from '../../services/fixedListValuesService';

interface EditCustomerProps {
  onCustomerUpdated: (customer: Customer) => void;
}

enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

const EditCustomer: React.FC<EditCustomerProps> = ({ onCustomerUpdated }) => {

  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
  const [fixedValues, setFixedValues] = useState<Map<String, FixedValueItem[]>>(new Map<String, FixedValueItem[]>());

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

      const arr = await getAllProperties();
      setAllProperties(arr);

      const map = new Map<String, FixedValueItem[]>(); 

      const promises = arr
      .filter(p => p.type === PropertyType.FIXED_LIST)
      .map(async p => {
        const id = p.id.toString();
        const temp = await handleGetFixedValuesList(id);
        map.set(id, temp);
      });

      await Promise.all(promises);

      setFixedValues(map);

    };
    fetchCustomer();
  }, [customerId]);

  function isProperty(value: unknown): value is Property {
    return (value as Property).id !== undefined;
  }

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, propertyId: number) => {
    
    const updateProperty = (propertyId: number, newValue: string) => {
      if (!customer) return;  
    
      const updatedProperties = structuredClone(customer.properties);
    
      updatedProperties.set(String(propertyId), newValue);
      var updatedCustomer: Customer = structuredClone(customer);
      updatedCustomer.properties = new Map(updatedProperties);
      
      setCustomer(updatedCustomer);

    };

    updateProperty(propertyId, event.target.value);
    
    
  };

  const handleSnackBarClose = () => {
    setSnackBar(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer) return;
    try {
      await onCustomerUpdated(customer);
    } catch(error) {
      setSnackBar({ 
        message: error instanceof Error ? error.message : 'Error editing customer', 
        severity: 'error' 
      });
  }

  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <>
    <FormCloseButton path='/customers'/>
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
      {customer.properties && Object.entries(customer.properties).length > 0 && <h3>Properties</h3>}
      <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
      {
        customer.properties ? (
          [...customer.properties.entries()].map(([key, value]) => (
            <div key={key}>
{(() => {
    const property = allProperties.find(p => p.id === Number(key));
    if (!property) return null; 
    
    const inputType = getInputType(property.type);
    const currentValue = value ? value as string : getDefaultValue(property.type);

    return (
      <>
        <label>{property.name}&nbsp;</label>
        {property.type === PropertyType.FIXED_LIST ? (
          <select
            value={currentValue}
            onChange={(e) => handlePropertyChange(e, property.id)}
          >
          {fixedValues.get(property.id.toString())?.map(item => (
            <option key={item.value} value={item.value}>
              {item.value}
            </option>
          ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={currentValue}
            onChange={(e) => handlePropertyChange(e, Number(key))}
          />
        )}
      </>
    );
  })()} 
            </div>
          ))
        ) : (
          <div></div> 
        )
      }
      </div>
      <button type="submit">Update Customer</button>
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

export default EditCustomer;
