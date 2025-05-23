import { createTrackedAbortController } from '../utils/AbortManager';
import { baseUrl, keyOfToken, keyOfRole } from './constService';

export const handleLogin = async (username: string, password: string) => {

  const controller = createTrackedAbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(baseUrl + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal,
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(keyOfToken, data.token);
      localStorage.setItem(keyOfRole, data.role);
      window.location.href = "/customers";
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    alert(`Login error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

export const getToken = (): String | null => {
  const token = localStorage.getItem(keyOfToken);
  return token;
};

export const saveToken = (token: String) => {
  localStorage.setItem(keyOfToken, token.valueOf()); 
  console.log("token saved");
}

export const getRole = (): String | null => {
  const role = localStorage.getItem(keyOfRole);
  return role;
};

export const saveRole = (token: String) => {
  localStorage.setItem(keyOfRole, token.valueOf()); 
  console.log("role saved");
}

export const handleCreateUser = async (username: string, password: string, roleid: number) => {
  
  const token = getToken();
  if (!token) {
    alert("token not found");
  }
  
  const controller = createTrackedAbortController();
  const signal = controller.signal;

  console.log(JSON.stringify({ username, password, roleid }));

    const response = await fetch(baseUrl + "/admin/users", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ username, password, role: roleid }),
      signal,
    });

    if (response.ok) {
      window.location.href = '/admin';
    } else {
      const errorData = await response.json();
      throw new Error(`Failed to create user: ${errorData.message}`);
    }
};

export const handleEditUser = async (userid: string, username: string, password: string, roleid: number) => {
  
  const token = getToken();
  if (!token) {
    alert("token not found");
  }
  
  const controller = createTrackedAbortController();
  const signal = controller.signal;

  console.log(userid);
  console.log(JSON.stringify({ username, password, roleid }));

  const response = await fetch(baseUrl + `/admin/users/${userid}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ username, password, role: roleid }),
    signal,
  });

  if (response.ok) {
    window.location.href = '/admin';
  } else {
    const errorData = await response.json();
    throw new Error(`Failed to create user: ${errorData.message}`);
  }
};