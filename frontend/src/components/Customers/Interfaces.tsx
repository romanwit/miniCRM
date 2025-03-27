enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

interface Property {
  id: number;
  name: string;
  type: PropertyType;
}

interface Customer {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Map<string, unknown>;
}

interface NewCustomer {
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Map<string, unknown>;
}
