import { createContext, useContext, useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';

const NetworkContext = createContext();

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}

// Map chain IDs to network names
const CHAIN_ID_MAP = {
  [mainnet.id]: 'mainnet',
  [sepolia.id]: 'sepolia',
  [polygon.id]: 'polygon',
  [polygonMumbai.id]: 'polygonMumbai',
};

export function NetworkProvider({ children }) {
  const chainId = useChainId();
  
  // Get current network from chain ID
  const currentNetwork = CHAIN_ID_MAP[chainId] || 'sepolia';

  useEffect(() => {
    console.log('🌐 Current network:', currentNetwork, '| Chain ID:', chainId);
  }, [currentNetwork, chainId]);

  // Switching is now handled by wagmi's useSwitchChain hook in components
  const switchNetwork = (network) => {
    console.log('⚠️ Use useSwitchChain hook from wagmi to switch networks');
  };

  return (
    <NetworkContext.Provider value={{ currentNetwork, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}