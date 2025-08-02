// src/mock/mockPlans.ts

import type { Plan } from "@/lib/types";

export const mockPlans: Plan[] = [
  {
    id: "plan_001",
    name: "Basic Care",
    amount: 5000,
    price: "₦5,000",
    period: "monthly",
    features: [
      { text: "Outpatient", included: true },
      { text: "Emergency", included: true },
      { text: "Dental", included: true },
      { text: "Maternity", included: false },
      { text: "Vision", included: false },
    ],
  },
  {
    id: "plan_002",
    name: "Family Plus",
    amount: 15000,
    price: "₦15,000",
    period: "monthly",
    features: [
      { text: "Outpatient", included: true },
      { text: "Emergency", included: true },
      { text: "Maternity", included: true },
      { text: "Dental", included: true },
      { text: "Vision", included: true },
    ],
    popular: true,
  },
];
