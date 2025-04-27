import React, { useEffect, useState } from 'react';
import { AlertColor } from '@mui/material';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import { useParams } from 'react-router-dom';
import FormCloseButton from '../Common/FormCloseButton';
import EditableList from '../Common/EditableList';

interface EditAdditionalPropertyProps {
    onGetAdditionalProperty: (id: string) => Promise<{name: string, type: PropertyType}>;
    onGetFixedValuesList: (id: string) => Promise<FixedValueItem[]>;
    onAdditionalPropertyEdited: (id: string, newProperty: NewProperty) => Promise<void>;
    onSaveFixedValuesList:  (id: String, list: String[])=> Promise<void>;
  }

const EditAdditionalProperty: React.FC<EditAdditionalPropertyProps> = 
  ({onGetAdditionalProperty, onAdditionalPropertyEdited, onGetFixedValuesList, onSaveFixedValuesList})=>{

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
    const [fixedValuesList, setFixedValuesList] = useState<FixedValueItem[]>([]);

    const propertyTypes = Object.values(PropertyType);

    useEffect(() => {

        const fetchData = async()=> {
          try {
            console.log("fetching");
            const {name, type} = await onGetAdditionalProperty(id!);
            setName(name);
            setType(type);
            if (type==PropertyType.FIXED_LIST) {
              console.log("fetching list");
              var list = await onGetFixedValuesList(id!);
              console.log('got list from handler');
              console.log(list);
              setFixedValuesList(list);
            }
          }
          catch(error) {
            setSnackBar({ 
              message: error instanceof Error ? error.message : 'Error reading additional property', 
              severity: 'error' 
            });
          }
        }

        fetchData();

      }, []);

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