import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';

interface User {
  id: number;
  username: string;
  role: {
    id: number;
    name: string;
  };
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();
      const response = await fetch(baseUrl + '/admin/users',
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const data: User[] = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.role.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;

