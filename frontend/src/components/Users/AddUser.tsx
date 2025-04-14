import React, { useState } from 'react';
import { SnackBarComponent } from '../SnackBarComponent';
import FormCloseButton from '../Common/FormCloseButton';
import { AlertColor } from '@mui/material';


interface AddUserProps {
    onUserAdded: (username: string, password: string, roleid: number) => Promise<void>;
  }

const AddUser: React.FC<AddUserProps> = ({onUserAdded})=> {

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<number>(1);
    const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
        
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await onUserAdded(userName, password, role);
        } catch (error) {
            setSnackBar({ 
                message: error instanceof Error ? error.message : 'Error adding user', 
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
                <label>User name</label>&nbsp;
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div>
                <label>Password</label>&nbsp;
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
        <div>
            <label>Role</label>&nbsp;
            <select value={role}> 
                <option key="1">USER</option>
                <option key="2">ADMIN</option>
            </select>
        </div>
        <button type="submit">Add User</button>
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
    )

}

export default AddUser;