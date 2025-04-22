import { createTrackedAbortController } from '../utils/AbortManager';
import { getToken } from './authService';
import { baseUrl } from './constService';

enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

export const handleAdditionalPropertyAdded = async (newProperty: NewProperty) => {
  
  const controller = createTrackedAbortController();
  const signal = controller.signal;
  
  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }
  
  const response = await fetch(baseUrl + "/admin/property-types", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(newProperty),
    signal,
  });

  if (!response.ok) throw new Error("Failed to add additionalProperty");

  window.location.href = '/admin';
};

export const handleAdditionalPropertyEdited = async (id: String, property: NewProperty) => {
  
  const controller = createTrackedAbortController();
  const signal = controller.signal;
  
  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }

    const response = await fetch(baseUrl + `/admin/property-types/${id}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(property),
      signal,
    });

    if (!response.ok) throw new Error("Failed to add additionalProperty");

    window.location.href = '/admin';
};

export const getDefaultValue = (propertyType?: PropertyType): string => {
  if (!propertyType) return '';
  switch (propertyType) {
    case PropertyType.STRING:
      return '';
      break;
    case PropertyType.DATE:
        return (new Date()).toISOString().split('T')[0];
        break;
    case PropertyType.NUMBER:
      return "0";
      break;
    default:
      return '';
      break;
  }
}

export const handleGetAdditionalProperty = async(id: string): Promise<{name: string, type: PropertyType}> => {

  let name: string = "";
  let type: PropertyType = PropertyType.STRING;

  const controller = createTrackedAbortController();
  const signal = controller.signal;
  
  const token = getToken();
  if (!token) {
    alert("token not found");
    return {name, type};
  }

  const response = await fetch(baseUrl + `/admin/property-types/${id}`, {
    method: 'GET',
    headers: { 
      "Authorization": `Bearer ${token}`
    },
    signal,
  });
  if (!response.ok) throw new Error('Failed to fetch additional property data');
  const data: Property = await response.json();

  name = data.name;
  type = data.type;

  return {name, type};
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

  const controller = createTrackedAbortController();
  const signal = controller.signal;

    const token = getToken();

    var result: Property[] = [];

    try {
        const response = await fetch(baseUrl + "/api/property-types", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`
          },
          signal
        });
    
        if (!response.ok) throw new Error("Failed to read property types");
        result = await response.json();
        
      } catch (error) {
        console.error('Error reading property types:', error);
        alert("Error reading property types. Please try again.");
      }

      return result;

}