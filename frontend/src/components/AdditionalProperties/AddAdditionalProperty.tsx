import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface AddAdditionalPropertyProps {
    onAdditionalPropertyAdded: (newProperty: NewProperty) => Promise<void>;
  }

const AddAdditionalProperty: React.FC<AddAdditionalPropertyProps> = ({onAdditionalPropertyAdded})=>{

    enum PropertyType {
        STRING = "STRING",
        DATE = "DATE",
        NUMBER = "NUMBER",
        FIXED_LIST = "FIXED_LIST"
      }

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<PropertyType>(PropertyType.STRING);
      
    const propertyTypes = Object.values(PropertyType);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newProperty: NewProperty = {
            name,
            type
        }
        try {
            await onAdditionalPropertyAdded(newProperty);
        } catch (error) {
            alert("!");
        }
    }

    return (
        <>
        <IconButton 
            onClick={() => window.location.href = '/admin'}
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
            <label>Type</label>&nbsp;
            <select value={type} onChange={(e) => setType(e.target.value as PropertyType)}>
                    {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                    {type}
                </option>
                ))}
            </select>
        </div>
        <button type="submit">Add Additional Property</button>
        </form>
        </>
    );
};

export default AddAdditionalProperty;