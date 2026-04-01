import { createContext, useContext } from 'react';

const NetworkContext = createContext();

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}

export function NetworkProvider({ children }) {
  // Only mainnet supported
  const currentNetwork = 'mainnet';
  const switchNetwork = () => {};

  return (
    <NetworkContext.Provider value={{ currentNetwork, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}
