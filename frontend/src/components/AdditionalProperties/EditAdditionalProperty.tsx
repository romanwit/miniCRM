import React, { useEffect, useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import { useParams } from 'react-router-dom';
import FormCloseButton from '../Common/FormCloseButton';


interface EditAdditionalPropertyProps {
    onGetAdditionalProperty: (id: string) => Promise<{name: string, type: PropertyType}>;
    onAdditionalPropertyEdited: (id: string, newProperty: NewProperty) => Promise<void>;
  }

const EditAdditionalProperty: React.FC<EditAdditionalPropertyProps> = ({onGetAdditionalProperty, onAdditionalPropertyEdited})=>{

    const { id } = useParams<{ id: string }>();

    if (id === undefined) {
      alert("Id is not found");
    }
    
    enum PropertyType {
        STRING = "STRING",
        DATE = "DATE",
        NUMBER = "NUMBER",
        FIXED_LIST = "FIXED_LIST"
      }

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<PropertyType>(PropertyType.STRING);
    const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
    
    const propertyTypes = Object.values(PropertyType);

    useEffect(() => {

        const fetchData = async()=> {
          try {
            const {name, type} = await onGetAdditionalProperty(id!);
            setName(name);
            setType(type);
          }
          catch(error) {

          }
        }

        fetchData();

      }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newProperty: NewProperty = {
            name,
            type
        }
        try {
            await onAdditionalPropertyEdited(String(id), newProperty);
        } catch (error) {
            setSnackBar({ 
                message: error instanceof Error ? error.message : 'Error editing additional property', 
                severity: 'error' 
              });
        }
    }

    const handleSnackBarClose = () => {
        setSnackBar(null);
      };

    return (
        <>
        <FormCloseButton path='/admin'/>
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
        <button type="submit">Edit Additional Property</button>
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

export default EditAdditionalProperty;