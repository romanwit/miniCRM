import { getToken } from './authService';
import { baseUrl, timeout } from './constService';

export const handleGetCustomersList = async(): Promise<{properties: Property[], customers: Customer[]}> => {
  
  const controller = new AbortController();
  const signal = controller.signal;

  const token = getToken();

  var properties: Property[] = [];
  var customers: Customer[] = [];

  const fetchPropertyTypes = async () => {
  
    try {
          const response = await fetch(baseUrl + '/api/property-types', 
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`
              },
              signal,
            });
          
          
          if (!response.ok) {
            console.log(await response.text());
            throw new Error(`Error getting properties: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          properties = data;
        }
        catch(error) {
          throw new Error('Error getting properties');
        }
      }

      const fetchCustomers = async () => {
            
            try {
              const response = await fetch(baseUrl + '/api/customers', 
                {
                  method: "GET",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                  signal,
                });
              if (!response.ok) {
                  throw new Error(`Error: ${response.status} ${response.statusText}`);
              }
              const rawData: Customer[] = await response.json();
              const data: Customer[] = rawData.map((item) => ({
                ...item,
                properties: new Map(Object.entries(item.properties)),
              }));
              customers = data.sort((a, b) => a.id - b.id);
            }
            catch(error) {
              console.error("Error getting customers:", error);
              return null;
            }
          };


      
            setTimeout(() => {
              controller.abort(); 
            }, timeout);
            
            await fetchPropertyTypes();
            await fetchCustomers();
            return {properties, customers};

          
          
}

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
    if (!response.ok) {
      var errorResponse: any = await response.json();
      throw new Error(`Failed to add customer${errorResponse.details ? `: ${errorResponse.details}` : ''}`);
    }
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
  
      if (!response.ok) {
        var errorResponse: any = await response.json();
        throw new Error(`Failed to add new customer properties${errorResponse.details ? `: ${errorResponse.details}` : ''}`);
      }

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

      
          const response = await fetch(baseUrl + `/api/customers/${customer.id}`, {
            method: "PUT",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json" 
            },
            body: JSON.stringify(customer),
            signal,
          });
          
          if (!response.ok) {
            var errorResponse: any = await response.json();
            throw new Error(`Failed to update customer${errorResponse.details ? `: ${errorResponse.details}` : ''}`);
          }
          
          const updatedCustomer = await response.json();
          console.log('Customer updated successfully:', updatedCustomer);
        

    }

    const editOrAddCustomerProperties = async() => {

        
          const response = await fetch(baseUrl + `/api/customer-properties/${customer.id}`, {
            method: "PUT",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json" 
            },
            body: JSON.stringify(Object.fromEntries(customer.properties)),
            signal,
          });
      
          if (!response.ok) {
            var errorResponse: any = await response.json();
            throw new Error(`Failed to update customer properties${errorResponse.details ? `: ${errorResponse.details}` : ''}`);
          }
          const updatedCustomerProperties = await response.json();
          console.log('Customer properites updated successfully:', updatedCustomerProperties);
          window.location.href = '/customers';

    }

    setTimeout(() => {
      controller.abort(); 
    }, timeout);

    await editCustomer();
    await editOrAddCustomerProperties();

  }

