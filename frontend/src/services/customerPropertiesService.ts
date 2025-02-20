import { getToken } from './authService';
import { baseUrl } from './constService';


export const getAllProperties = async ():Promise<Property[]> => {

    var result: Property[] = [];

    const token = getToken();

    try {
        const response = await fetch(baseUrl + "/api/customer-properties", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
    
        if (!response.ok) throw new Error("Failed to read customer properties");
        result = await response.json();
        
      } catch (error) {
        console.error('Error reading customer properties:', error);
        alert("Error reading customer properties. Please try again.");
      }

    return result;

}