import { createContext, useContext, useState } from 'react;'

//Create the context
const AuthContext = createContext();

//Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}