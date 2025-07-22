export type ApiResponse<T> = {
  status_code: number;
  message: string;
  data: T;
};

export type User = {
  id: number;
  last_login: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  date_created: Date;
  contribution_amount: number;
  group?: number;
  avatar?: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  user: User;
  token: string;
};
