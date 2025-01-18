import React, { useState, useEffect } from 'react';

interface PropertyType {
  id: number;
  name: string;
  type: 'STRING' | 'DATE' | 'NUMBER' | 'FIXED_LIST';
}

const PropertyTypesManagement: React.FC = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      const response = await fetch('/api/property-types');
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

