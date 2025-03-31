import { baseUrl } from './constService';

const keyOfToken: string = "auth_token_xyz";
const keyOfRole: string = "crm_user_role";

export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(baseUrl + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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

export const handleRegister = async (username: string, password: string, email: string) => {
  try {
    const response = await fetch(baseUrl + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "/login";
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert("An error occurred. Please try again.");
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

