
import { getToken } from './tokenService';

export const handleCustomerAdded = async (newCustomer: Customer) => {
  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }
  try {
    const response = await fetch("http://localhost:8080/api/customers", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) throw new Error("Failed to add customer");
    //return await response.json();
    window.location.href = '/customers';
    //TODO: reload ClientsList UI
  } catch (error) {
    console.error('Error adding customer:', error);
    alert("Error adding customer. Please try again.");
  }
  /*finally {
    setLoading(false);
  }*/
};

export const handleCustomerUpdated = async (customer: Customer) => {
  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }
  try {
    const response = await fetch(`http://localhost:8080/api/customers/${customer.id}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(customer),
    });

    if (!response.ok) throw new Error(`Failed to update customer: ${response.statusText}`);

    const updatedCustomer = await response.json();
    console.log('Customer updated successfully:', updatedCustomer);
    alert('Customer updated successfully!');
    window.location.href = '/customers';

  } catch (error) {
    console.error('Error updating Customer:', error);
    alert(`Error updating Customer: ${(error as Error).message}`);
  }
};

