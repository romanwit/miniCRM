import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';

interface PropertyType {
  id: number;
  name: string;
  type: 'STRING' | 'DATE' | 'NUMBER' | 'FIXED_LIST';
}

const PropertyTypesManagement: React.FC = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      const token = getToken();
      const response = await fetch(baseUrl + '/admin/property-types', 
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const data: PropertyType[] = await response.json();
      setPropertyTypes(data);
    };
    fetchPropertyTypes();
  }, []);

  return (
    <div>
      <h2>Property Types Management</h2>
      <ul>
        {propertyTypes.map((type) => (
          <li key={type.id}>{type.name} - {type.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyTypesManagement;

