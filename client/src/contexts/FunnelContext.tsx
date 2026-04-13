import { createContext, useContext, useState, ReactNode } from 'react';

export interface FunnelData {
  age: number;
  gender: 'male' | 'female' | '';
  tobacco: boolean;
  coverageAmount: number;
  policyType: 'term' | 'whole' | 'final' | '';
  termLength: number; // 10, 15, 20, 25, 30 — only relevant for term life
  firstName: string;
  email: string;
  phone: string;
  monthlyPremium: number;
  leadId: number | null; // Set after lead is saved to database
}

interface FunnelContextType {
  data: FunnelData;
  updateData: (updates: Partial<FunnelData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const defaultData: FunnelData = {
  age: 35,
  gender: '',
  tobacco: false,
  coverageAmount: 250000,
  policyType: '',
  termLength: 20,
  firstName: '',
  email: '',
  phone: '',
  monthlyPremium: 0,
  leadId: null,
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FunnelData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (updates: Partial<FunnelData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
    setCurrentStep(1);
  };

  return (
    <FunnelContext.Provider value={{ data, updateData, resetData, currentStep, setCurrentStep }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within FunnelProvider');
  }
  return context;
}
