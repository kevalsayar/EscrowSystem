import { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
   const [user, setUser] = useState("Prashant");
   const value = { user, setUser }
   return (
      <AppContext.Provider value={value}>
         {children}
      </AppContext.Provider>
   )
};