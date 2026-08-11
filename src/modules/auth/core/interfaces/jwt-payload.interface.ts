export interface JwtPayload {
  userId: number | string;
  email: string;
  role: string;
  permissions?: string[];
  name?: string;
}


