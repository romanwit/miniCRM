import { getToken } from './authService';
import { baseUrl } from './constService';

export const getAllPropertyTypes = async ():Promise<PropertyType[]> => {

    const token = getToken();

    var result: PropertyType[] = [];

    try {
        const response = await fetch(baseUrl + "/api/property-types", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`
          }
        });
    
        if (!response.ok) throw new Error("Failed to read property types");
        result = await response.json();
        
      } catch (error) {
        console.error('Error reading property types:', error);
        alert("Error reading property types. Please try again.");
      }

      return result;

}