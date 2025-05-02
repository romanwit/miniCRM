export enum PropertyType {
  STRING = "STRING",
  DATE = "DATE",
  NUMBER = "NUMBER",
  FIXED_LIST = "FIXED_LIST"
}

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
}

export interface NewProperty {
  name: string;
  type: PropertyType;
}

export interface Customer {
  id: number;
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Map<string, unknown>;
}

export interface NewCustomer {
  name: string;
  registrationDate: string;
  email: string;
  phone: string;
  properties: Map<string, unknown>;
}
