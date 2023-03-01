import { createContext, useState } from 'react';

export const Context = createContext(null);

export function ContextProvider({ children }) {

  return (
    <Context.Provider>
      {children}
    </Context.Provider>
  )
}
