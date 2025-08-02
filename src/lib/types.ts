export type ApiResponse<T> = {
  status_code: number;
  message: string;
  data: T;
  token?: string; // optional for login/signup responses
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // Add this if not already there
  walletBalance?: number;
};


export interface AuthUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  // ...add any other fields returned in user
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  wallet: Wallet;
}


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
  method: "card" | "bank";
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  rememberCard: boolean;
  bankTransferCompleted: boolean;
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

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  amount?: number;
  price: string;
  period: string;
  features: PlanFeature[];
  popular?: boolean;
  startDate?: string;
  category?: string;
}

export interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
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
