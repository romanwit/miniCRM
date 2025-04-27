import React, { useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import FormCloseButton from '../Common/FormCloseButton';
import EditableList from '../Common/EditableList';

interface FixedValueItem {
    id: number;
    value: string;
  }


interface AddAdditionalPropertyProps {
    onAdditionalPropertyAdded: (newProperty: NewProperty) => Promise<string>;
    onSaveFixedValuesList:  (id: String, list: String[])=> Promise<void>;
  }

const AddAdditionalProperty: React.FC<AddAdditionalPropertyProps> = ({
    onAdditionalPropertyAdded, onSaveFixedValuesList})=>{

    enum PropertyType {
        STRING = "STRING",
        DATE = "DATE",
        NUMBER = "NUMBER",
        FIXED_LIST = "FIXED_LIST"
      }

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<PropertyType>(PropertyType.STRING);
    const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
    const [fixedValuesList, setFixedValuesList] = useState<FixedValueItem[]>([]);
    
      
    const propertyTypes = Object.values(PropertyType);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        var id: string = "";
        event.preventDefault();
        const newProperty: NewProperty = {
            name,
            type
        }
        try {
            id = await onAdditionalPropertyAdded(newProperty);
        } catch (error) {
            setSnackBar({ 
                message: error instanceof Error ? error.message : 'Error adding additional property', 
                severity: 'error' 
              });
        }

        if (type==PropertyType.FIXED_LIST) {
            try {
              await onSaveFixedValuesList(id!, fixedValuesList.map(item=>item.value));
            }
            catch(error) {
              setSnackBar({ 
                message: error instanceof Error ? error.message : 'Error editing fixed list values', 
                severity: 'error' 
              });
            }
          }
          window.location.href = '/admin';
    }

    const handleSnackBarClose = () => {
        setSnackBar(null);
      };

      const handleFixedValuesListUpdate = (updatedItems: string[]) => {
        console.log("Updated list:", updatedItems);
        setFixedValuesList(updatedItems.map((value, index) => ({ id: index + 1, value })));
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
            {type === PropertyType.FIXED_LIST && <EditableList 
              onFixedListValuesEdited={handleFixedValuesListUpdate} 
              list={fixedValuesList} />}  
        </div>
        <button type="submit">Add Additional Property</button>
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

export default AddAdditionalProperty;