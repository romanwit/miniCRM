import { getToken } from './authService';
import { baseUrl } from './constService';

export const handleCustomerAdded = async (newCustomer: Customer) => {
  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }
  try {
    const response = await fetch(baseUrl + "/api/customers", {
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
        const response = await fetch(baseUrl + `/api/customers/${customer.id}`, {
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
      }
      catch (error) {
        console.error('Error updating Customer:', error);
        alert(`Error updating Customer: ${(error as Error).message}`);
      }
      console.log('1');
      console.log(JSON.stringify(Object.fromEntries(customer.properties)));
      try {
        const response = await fetch(baseUrl + `/api/customer-properties/${customer.id}`, {
          method: "PUT",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(Object.fromEntries(customer.properties)),
        });
    
        if (!response.ok) throw new Error(`Failed to update customer properties: ${response.statusText}`);
    
        const updatedCustomerProperties = await response.json();
        console.log('Customer properites updated successfully:', updatedCustomerProperties);
        alert('Customer updated successfully!');
        window.location.href = '/customers';

    } catch (error) {
      console.error('Error updating Customer:', error);
      alert(`Error updating Customer: ${(error as Error).message}`);
    }
    finally {

    }
  }

