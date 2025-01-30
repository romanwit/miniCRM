interface Property {
  id: number;
  type: string;
  value: string;
}

interface Client {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Property[];
}


