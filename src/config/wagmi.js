import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';

// Your WalletConnect Project ID from https://cloud.walletconnect.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '80c8f419c1d3760c8ce5492593487aea';

if (!projectId) {
  console.warn('⚠️ WalletConnect projectId is not set');
}

export const config = getDefaultConfig({
  appName: 'Swap Platform',
  projectId,
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  ssr: false, // We're not using server-side rendering
});