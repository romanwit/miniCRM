import { getToken } from './authService';
import { baseUrl, timeout } from './constService';

export const handleCustomerAdded = async (newCustomer: NewCustomer, newProperties:Map<string, unknown> ) => {
  
  const controller = new AbortController();
  const signal = controller.signal;

  const token = getToken();
  if (!token) {
    alert("token not found");
    return;
  }

  var customerId:number;
  
  const addCustomer = async () => {
    const response = await fetch(baseUrl + "/api/customers", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(newCustomer),
      signal,
    });
    if (!response.ok) throw new Error("Failed to add customer"); 
    const customer:Customer = await response.json() as Customer;
    customerId = customer.id;
  }

  const addNewCustomerProperties = async()=>{
    
      const response = await fetch(baseUrl + `/api/customer-properties/${customerId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(Object.fromEntries(newProperties)),
        signal,
      });
  
      if (!response.ok) throw new Error(`Failed to update customer properties: ${response.statusText}`);
  
      const updatedCustomerProperties = await response.json();
      console.log('Customer properites updated successfully:', updatedCustomerProperties);
    }

    setTimeout(() => {
      controller.abort(); 
    }, timeout);

    await addCustomer();
    await addNewCustomerProperties();

    window.location.href = '/customers';
};

export const handleCustomerUpdated = async (customer: Customer) => {

  const controller = new AbortController();
  const signal = controller.signal;

    const token = getToken();
    if (!token) {
      alert("token not found");
      return;
    }

    const editCustomer = async()=> {

      try {
          const response = await fetch(baseUrl + `/api/customers/${customer.id}`, {
            method: "PUT",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json" 
            },
            body: JSON.stringify(customer),
            signal,
          });
          if (!response.ok) throw new Error(`Failed to update customer: ${response.statusText}`);

          const updatedCustomer = await response.json();
          console.log('Customer updated successfully:', updatedCustomer);
        }
        catch (error) {
          console.error('Error updating Customer:', error);
          alert(`Error updating Customer: ${(error as Error).message}`);
        }

    }

    const editOrAddCustomerProperties = async() => {

        try {
          const response = await fetch(baseUrl + `/api/customer-properties/${customer.id}`, {
            method: "PUT",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json" 
            },
            body: JSON.stringify(Object.fromEntries(customer.properties)),
            signal,
          });
      
          if (!response.ok) throw new Error(`Failed to update customer properties: ${response.statusText}`);
      
          const updatedCustomerProperties = await response.json();
          console.log('Customer properites updated successfully:', updatedCustomerProperties);
          window.location.href = '/customers';

      } catch (error) {
        console.error('Error updating Customer:', error);
        alert(`Error updating Customer: ${(error as Error).message}`);
      }
      finally {

      }

    }

    setTimeout(() => {
      controller.abort(); 
    }, timeout);
    
    await editCustomer();
    await editOrAddCustomerProperties();

  }

