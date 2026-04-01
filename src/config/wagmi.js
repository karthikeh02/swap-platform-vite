import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '80c8f419c1d3760c8ce5492593487aea';

if (!projectId) {
  console.warn('WalletConnect projectId is not set');
}

export const config = getDefaultConfig({
  appName: 'EtherSwap',
  projectId,
  chains: [mainnet],
  ssr: false,
});
