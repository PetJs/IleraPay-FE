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
  walletBalance: number;
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

export interface PaymentData {
  method: 'card' | 'bank';
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  rememberCard: boolean;
  bankTransferCompleted: boolean;
}


interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  amount?: number;
  id: string;
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  popular?: boolean;
  startDate?: string;
}


export interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export interface RememberedCard {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
}

export interface ClaimPayload {
  type: "medical" | "dental" | "vision";
  title: string;
  description: string;
  amount: number;
  receiptUrl: string;
  documents: string[];
}


export interface PaymentPayload {
  amount: number;
  email: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}