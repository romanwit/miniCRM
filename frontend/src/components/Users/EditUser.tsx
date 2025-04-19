import React, { useEffect, useState } from 'react';
import { SnackBarComponent } from '../Common/SnackBarComponent';
import FormCloseButton from '../Common/FormCloseButton';
import { AlertColor } from '@mui/material';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';
import { useParams } from 'react-router-dom';


interface EditUserProps {
    onUserEdited: (userid: string, username: string, password: string, roleid: number) => Promise<void>;
  }

const EditUser: React.FC<EditUserProps> = ({onUserEdited})=> {

    interface Role {
        id: number,
        name: string
    }

    const { id } = useParams<{ id: string }>();
    if (!id) {
        throw new Error("user id is missing");
    }
   
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<number>(1);
    const [roles, setRoles] = useState<Role[]>([]);
    const [snackBar, setSnackBar] = useState<{ message: string; severity: AlertColor } | null>(null);
        
    useEffect(() => {
        
        const token = getToken();

        const fetchRoles = async () => {
        
            try {
                const response = await fetch(baseUrl + "/admin/roles", {
                method: 'GET',
                headers: { 
                    "Authorization": `Bearer ${token}`
                }
                });
                if (!response.ok) throw new Error('Failed to fetch roles');
                const data: Role[] = await response.json();
                setRoles(data);
            } catch (err) {
                setSnackBar({ 
                    message: err instanceof Error ? err.message : 'Error fetching roles', 
                    severity: 'error' 
                });
            } 

        };
        const fetchUser = async () => {
                
                    try {
                        const response = await fetch(baseUrl + `/admin/users/${id}`, {
                        method: 'GET',
                        headers: { 
                            "Authorization": `Bearer ${token}`
                        }
                        });
                        if (!response.ok) throw new Error('Failed to fetch user');
                        const data = await response.json();
                        setRole(data.roleId);
                        setUserName(data.username);
                        console.log(data);

                    } catch (err) {
                        setSnackBar({ 
                            message: err instanceof Error ? err.message : 'Error fetching roles', 
                            severity: 'error' 
                        });
                    } 
        
                };
        fetchRoles();
        fetchUser();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await onUserEdited(id, userName, password, role);
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
            <select value={role} 
                onChange={(e) => setRole(parseInt(e.target.value))}> 
                {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
      ))}
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

export default EditUser;