import { getToken } from './authService';
import { baseUrl } from './constService';

enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

export const getInputType = (propertyType?: PropertyType): string => {
  if (!propertyType) return 'text';
  switch (propertyType) {
    case PropertyType.STRING:
      return 'text';
      break;
    case PropertyType.DATE: 
      return 'date';
      break;
    case PropertyType.NUMBER:
      return 'number';
      break;
    default:
      return 'text';
      break;
  }
}

export const getPropertyName = async (propertyTypeId: number): Promise<string | undefined> => {

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