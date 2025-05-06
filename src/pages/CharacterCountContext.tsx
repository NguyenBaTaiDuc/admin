import React, { createContext, useContext, useState } from "react";

interface CharacterCountContextType {
  chatCharCount: number;
  setChatCharCount: (count: number) => void;
}

const CharacterCountContext = createContext<CharacterCountContextType>({
  chatCharCount: 0,
  setChatCharCount: () => {},
});

export const CharacterCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatCharCount, setChatCharCount] = useState(0);
  return (
    <CharacterCountContext.Provider value={{ chatCharCount, setChatCharCount }}>
      {children}
    </CharacterCountContext.Provider>
  );
};

export const useCharacterCount = () => useContext(CharacterCountContext);
