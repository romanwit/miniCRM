import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Загрузка данных пользователей
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
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
          <li key={user.id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;

