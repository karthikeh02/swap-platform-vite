import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useChainId, useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { NETWORKS } from '../utils/constants';

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  const networks = [
    {
      id: 'mainnet',
      name: 'Ethereum Mainnet',
      icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      chainId: mainnet.id
    }
  ];

  const getCurrentNetwork = () => {
    const network = networks.find(n => n.chainId === chainId);
    return network?.id || 'mainnet';
  };

  const currentNetwork = getCurrentNetwork();

  const handleSwitch = async (network) => {
    if (network.chainId !== chainId && switchChain) {
      try {
        switchChain({ chainId: network.chainId });
      } catch (error) {
        console.error('Network switch failed:', error);
      }
    }
    setIsOpen(false);
  };

  const currentNetworkConfig = NETWORKS[currentNetwork];
  const currentNetworkInfo = networks.find(n => n.id === currentNetwork);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentNetworkInfo?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-slate-500 font-semibold uppercase">
                Select Network
              </div>

              {networks.map((network) => {
                const isActive = network.chainId === chainId;
                const config = NETWORKS[network.id];

                return (
                  <button
                    key={network.id}
                    onClick={() => handleSwitch(network)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-50 text-purple-700'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <img src={network.icon} alt={network.name} className="w-7 h-7 rounded-full" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{network.name}</div>
                      <div className={`text-xs ${isActive ? 'text-purple-500' : 'text-slate-400'}`}>
                        Chain ID: {config?.chainIdDecimal}
                      </div>
                    </div>
                    {isActive && <Check className="w-5 h-5 text-purple-600" />}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <p className="text-xs text-slate-400 text-center">
                Switch networks directly from your wallet
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
