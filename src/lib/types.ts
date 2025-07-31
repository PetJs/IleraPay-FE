export type ApiResponse<T> = {
  status_code: number;
  message: string;
  data: T;
  token?: string;
};

export type User = {
  id: number;
  last_login: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  date_created: Date;
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

export interface CardComponentProps {
  title?: string;
  openIcon?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
}

export type Transaction = {
  date: string;
  tag: "in" | "out";
  amount: number;
  title: string;
};

export interface TransactionListProps {
  data: Transaction[];
}