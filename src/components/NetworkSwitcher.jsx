import { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useChainId, useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { NETWORKS } from '../utils/constants';

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  const networks = [
    { 
      id: 'sepolia', 
      name: 'Sepolia Testnet', 
      icon: '🧪',
      chainId: sepolia.id
    },
    { 
      id: 'mainnet', 
      name: 'Ethereum Mainnet', 
      icon: '⟠',
      chainId: mainnet.id
    }
  ];

  // Map chainId to network id
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
        className={`flex items-center gap-2 bg-gradient-to-r ${currentNetworkConfig.color} text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentNetworkInfo?.name}</span>
        <span className="sm:hidden">{currentNetworkInfo?.icon}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase">
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
                        ? 'bg-gradient-to-r ' + config.color + ' text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{network.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{network.name}</div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        Chain ID: {config.chainIdDecimal}
                      </div>
                    </div>
                    {isActive && <Check className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
            
            <div className="border-t border-gray-800 p-3 bg-gray-800/50">
              <p className="text-xs text-gray-400 text-center">
                💡 Switch networks directly from your wallet
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}