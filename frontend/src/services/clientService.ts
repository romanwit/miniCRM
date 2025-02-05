
export const handleClientAdded = async (newCustomer: Customer) => {
  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) throw new Error("Failed to add client");
    return await response.json();

    //TODO: reload ClientsList UI
  } catch (error) {
    console.error('Error adding customer:', error);
    alert("Error adding customer. Please try again.");
  }
  /*finally {
    setLoading(false);
  }*/
};

export const handleClientUpdated = async (customer: Customer) => {
  try {
    const response = await fetch(`/api/customers/${customer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    if (!response.ok) throw new Error(`Failed to update client: ${response.statusText}`);

    const updatedClient = await response.json();
    console.log('Customer updated successfully:', updatedClient);
    alert('Customer updated successfully!');

  } catch (error) {
    console.error('Error updating Customer:', error);
    alert(`Error updating Customer: ${(error as Error).message}`);
  }
};

