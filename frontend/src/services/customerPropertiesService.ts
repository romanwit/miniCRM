import { createTrackedAbortController } from '../utils/AbortManager';
import { getToken } from './authService';
import { baseUrl, timeout } from './constService';


export const getAllProperties = async ():Promise<Property[]> => {

    var result: Property[] = [];

    const controller = createTrackedAbortController();
    const signal = controller.signal;

    const token = getToken();

    try {

      setTimeout(() => {
        controller.abort(); 
      }, timeout);
      
        const response = await fetch(baseUrl + "/api/customer-properties", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`
          },
          signal,
        });

        if (!response.ok) throw new Error("Failed to read customer properties");
        result = await response.json();
        
      } catch (error) {
        console.error('Error reading customer properties:', error);
        alert("Error reading customer properties. Please try again.");
      }

    return result;

}