import { createContext, useContext, useState, ReactNode } from 'react';

export interface FunnelData {
  age: number;
  gender: 'male' | 'female';
  tobacco: boolean;
  coverageAmount: number;
  policyType: 'term' | 'whole' | 'final';
  healthRating: 'preferred-plus' | 'preferred' | 'standard' | 'substandard';
  name?: string;
  email?: string;
  phone?: string;
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
  gender: 'male',
  tobacco: false,
  coverageAmount: 250000,
  policyType: 'term',
  healthRating: 'preferred',
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
