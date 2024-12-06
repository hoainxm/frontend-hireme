import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfileThunk } from '../../../store/reducer/userSlice/userThunk';
import { useAppDispatch } from '../../../store/store';

interface CVContextProps {
  myListCV: string[];
  fetchCVs: () => Promise<void>;
}

const CVContext = createContext<CVContextProps | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const [myListCV, setMyListCV] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const fetchCVs = async () => {
    const res = await dispatch(getUserProfileThunk()).unwrap();
    if (res && res.data) {
      setMyListCV(res.data.myCV || []);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  return <CVContext.Provider value={{ myListCV, fetchCVs }}>{children}</CVContext.Provider>;
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};
