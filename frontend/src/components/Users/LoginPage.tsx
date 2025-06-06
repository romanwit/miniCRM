import React, { useState, useEffect, useRef } from 'react';
import { getToken, saveToken } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null); 

  const isTokenValid = (token: string): boolean => {
    console.log("checking token validity");
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000; 
      return decoded.exp && decoded.exp > now; 
    } catch (error) {
      console.log(`token is expired with error ${error}`);
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
    if (inputRef.current) {
      inputRef.current.focus(); 
    }
  }, []);
  
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("token found");
      if (isTokenValid(token.valueOf())) {
        const username = getUsernameFromToken(token.valueOf());
        if (username) {
          localStorage.setItem('username', username);
          navigate('/customers'); 
        }
      } else {
        console.log("removing token from storage");
        localStorage.removeItem('auth_token_xyz'); 
        localStorage.removeItem('username'); 
      }
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin(username, password); 

    const token = getToken();
    if (token && isTokenValid(token.valueOf())) {
      saveToken(token);
      const username = getUsernameFromToken(token.valueOf());
      if (username) {
        localStorage.setItem('username', username);
        navigate('/customers'); 
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div>
        <label>Username</label>&nbsp;&nbsp;
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          ref={inputRef}
          required
        />
      </div>
      <div>
        <label>Password</label>&nbsp;&nbsp;
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
