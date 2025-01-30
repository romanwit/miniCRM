import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000; 
      return decoded.exp && decoded.exp > now; 
    } catch (error) {
      return false; 
    }
  };

  const getUsernameFromToken = (token: string): string | null => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub; 
    } catch (error) {
      return null;
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem('auth_token_xyz');
    if (token && isTokenValid(token)) {
      const username = getUsernameFromToken(token);
      if (username) {
        localStorage.setItem('username', username);
        navigate('/dashboard'); 
      }
    } else {
      localStorage.removeItem('auth_token_xyz'); 
      localStorage.removeItem('username'); 
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin(username, password); 

    const token = localStorage.getItem('auth_token_xyz');
    if (token && isTokenValid(token)) {
      localStorage.setItem('auth_token_xyz', token); 
      const username = getUsernameFromToken(token);
      if (username) {
        localStorage.setItem('username', username);
        navigate('/dashboard'); 
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
