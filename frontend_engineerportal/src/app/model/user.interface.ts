export enum AdminRoles {
  business_operator = 'Business Operator',
  engineer = 'Engineer'
}

export interface User {
  adminEmail: string;
  adminPassword: string;
  adminRole: AdminRoles;
}