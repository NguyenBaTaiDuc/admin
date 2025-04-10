import React, { createContext, useState } from "react";

interface IContextProps {
  loading: boolean;
  setLoading: (e: boolean) => void;
}

export const StateContext = createContext<IContextProps>({
  loading: false,
  setLoading: () => {},
});

interface IProps {
  children: React.ReactNode;
}

export function StateProvider({ children }: IProps) {
  const [loading, setLoading] = useState(false);

  return (
    <StateContext.Provider
      value={{
        loading,
        setLoading,
      }}>
      {children}
    </StateContext.Provider>
  );
}
