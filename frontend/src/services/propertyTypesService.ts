import { getToken } from './authService';
import { baseUrl } from './constService';

export const getPropertyName = async(propertyTypeId: number): Promise<string | undefined> => {

  var properties: Property[] = await getAllProperties();
  var property = properties.find(property=>property.id==propertyTypeId);
  return property?.name;
}

export const getAllProperties = async ():Promise<Property[]> => {

    const token = getToken();

    var result: Property[] = [];

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