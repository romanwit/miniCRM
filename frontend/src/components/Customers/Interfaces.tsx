enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

interface Property {
  id: number;
  type: PropertyType;
  value: unknown;
}

interface Customer {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Map<PropertyType, unknown>;
}
