import React, { useEffect, useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';
import { getAllProperties, getDefaultValue, getInputType } from '../../services/propertyTypesService';
import FormCloseButton from '../Common/FormCloseButton';
import { handleGetFixedValuesList } from '../../services/fixedListValuesService';

interface AddCustomerProps {
  onCustomerAdded: (customer: NewCustomer, newProperties: Map<string, unknown>) => Promise<void>;
}

enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onCustomerAdded }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesValues, setPropertiesValues] = useState<Map<string, unknown>>(new Map<string, unknown>());
  const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
  const [fixedValues, setFixedValues] = useState<Map<String, FixedValueItem[]>>(new Map<String, FixedValueItem[]>());


  useEffect(() => {
    const fetchProperties = async () => {
      /*
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
      */
      
      const arr = await getAllProperties();
      setProperties(arr);

      const vals = new Map<string, unknown>();
      arr.forEach(p=>{
        vals.set(String(p.id), getDefaultValue(p.type));
      })
      setPropertiesValues(vals);
      
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

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, propertyId: number) => {
      
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
      {properties && Object.entries(properties).length > 0}
          <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
            {
              properties ? (
                [...properties.entries()].map(([key, value]) => (
                  <div key={value.id}>
                  {(() => {
                      const property = value;//properties[key];
                      if (!property) return null; 
                      
                      const inputType = getInputType(property.type);
                      const currentValue = propertiesValues.get(String(property.id));

                      console.log(`react returning key ${key}, name ${property.name}, inputType ${inputType}, property.id ${String(property.id)}, propertiesValues.get(String(property.id)) ${propertiesValues.get(String(property.id))}, getDefaultValue(property.type) ${getDefaultValue(property.type)}, currentValue ${currentValue}`);

                      return (
                        <>
                          <label>{property.name}&nbsp;</label>
                          {property.type === PropertyType.FIXED_LIST ? (
                            <select
                            value={currentValue as string}
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
                              value={currentValue as string | number} 
                              onChange={(e) => handlePropertyChange(e, Number(value.id))}
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

