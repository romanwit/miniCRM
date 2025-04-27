import React from 'react';
import UsersManagement from './UsersManagement';
import PropertyTypesManagement from './PropertyTypesManagement';
import FixedListValuesManagement from './FixedListValuesManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UsersManagement />
      <PropertyTypesManagement />
    </div>
  );
};

export default AdminDashboard;

