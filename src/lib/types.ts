import type { ReactNode } from "react";

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: ReactNode;
  diagnosis?: {
    symptoms: string;
    diagnosis: string;
    confidenceLevel: number;
    urgencyAlert: string;
    suggestedMedicines: string;
    suggestedDoctors: string;
  };
};

export type HealthCenter = {
  name: string;
  address: string;
  phone: string;
  specialty?: string;
};
