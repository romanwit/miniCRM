import React, { useState, useEffect } from 'react';
import { getToken } from '../../services/authService';
import { baseUrl } from '../../services/constService';

interface FixedListValue {
  id: number;
  propertyId: number;
  value: string;
}

const FixedListValuesManagement: React.FC = () => {
  const [fixedListValues, setFixedListValues] = useState<FixedListValue[]>([]);

  useEffect(() => {
    const fetchFixedListValues = async () => {
      const token = getToken();
      const response = await fetch(baseUrl + '/admin/fixed-list-values', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data: FixedListValue[] = await response.json();
      setFixedListValues(data);
    };
    fetchFixedListValues();
  }, []);

  return (
    <div>
      <h2>Fixed List Values Management</h2>
      <ul>
        {fixedListValues.map((value) => (
          <li key={value.id}>{value.value} (Property ID: {value.propertyId})</li>
        ))}
      </ul>
    </div>
  );
};

export default FixedListValuesManagement;

