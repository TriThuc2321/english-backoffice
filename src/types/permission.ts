export interface Permission {
  id: number;
  action: string;
  subject: string;
  status: string;
}

export type GetPermissionsResponse = Permission[];
