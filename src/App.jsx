// import { useState, useEffect } from 'react';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAccount } from 'wagmi';
// import { Toaster } from 'react-hot-toast';
// import { ArrowDownUp, Phone, RefreshCw, ChevronDown } from 'lucide-react';
// import { useNetwork } from './context/NetworkContext';
// import { useTokens } from './hooks/useTokens';
// import { usePrices } from './hooks/usePrices';
// import SwapInterface from './components/SwapInterface';
// import TokenSelector from './components/TokenSelector';
// import NetworkSwitcher from './components/NetworkSwitcher';
// import { CONTACT_NUMBER, NETWORKS } from './utils/constants';
// import './App.css';

// export default function App() {
//   const { currentNetwork } = useNetwork();
//   const { address, isConnected } = useAccount();
//   const { tokens, loading: tokensLoading, reload: reloadTokens } = useTokens();
//   const { prices, loading: pricesLoading, fetchPrice } = usePrices();

//   const [fromToken, setFromToken] = useState(null);
//   const [toToken, setToToken] = useState(null);
//   const [showFromSelector, setShowFromSelector] = useState(false);
//   const [showToSelector, setShowToSelector] = useState(false);

//   useEffect(() => {
//     if (tokens.length > 0 && !fromToken && !toToken) {
//       setFromToken(tokens[0]);
//       setToToken(tokens[1] || tokens[0]);
//     }
//   }, [tokens]);

//   useEffect(() => {
//     if (fromToken) fetchPrice(fromToken);
//     if (toToken) fetchPrice(toToken);
//   }, [fromToken, toToken]);

//   const switchTokens = () => {
//     const temp = fromToken;
//     setFromToken(toToken);
//     setToToken(temp);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0f2f] to-[#2a0f5f] relative overflow-hidden">
//       <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 pointer-events-none"></div>

//       <Toaster position="top-right" toastOptions={{ style: { background: '#1a0f3f', color: 'white' } }} />

//       {/* Responsive Header */}
//       <header className="px-4 py-4 md:py-6 max-w-5xl mx-auto">
//         <div className="flex items-center justify-between">
//           {/* Logo + Compact Title */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-cyan flex-shrink-0">
//               <ArrowDownUp size={22} className="text-white" />
//             </div>
//             <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//               EtherSwap
//             </h1>
//           </div>

//           {/* Right side: NetworkSwitcher (hidden on mobile) + Connect Wallet */}
//           <div className="flex items-center gap-3 flex-shrink-0">
//             {/* NetworkSwitcher only visible on sm and larger */}
//             <div className="hidden sm:block">
//               <NetworkSwitcher />
//             </div>
//             <ConnectButton />
//           </div>
//         </div>
//       </header>

//       {/* Main Content - unchanged */}
//       <main className="max-w-md mx-auto px-4 py-8 md:py-12">
//         {/* Contact Card */}
//         <div className="glass p-5 mb-8 text-center shadow-2xl glow-purple transform hover:scale-105 transition-all">
//           <div className="flex items-center justify-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//               <Phone size={20} className="text-white" />
//             </div>
//             <div>
//               <p className="text-white font-semibold text-lg">Complete Your Swap</p>
//               <a
//                 href={`tel:${CONTACT_NUMBER}`}
//                 className="text-cyan-400 hover:text-cyan-300 font-bold text-xl mt-1 block"
//               >
//                 {CONTACT_NUMBER}
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Swap Card */}
//         <div className="glass p-6 md:p-8 rounded-3xl glow-purple border border-purple-500/30">
//           <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Swap
//           </h2>

//           <div className="space-y-4">
//             {/* From Token */}
//             <button
//               onClick={() => setShowFromSelector(true)}
//               className="w-full glass p-4 rounded-2xl flex items-center justify-between hover:border-cyan-500/50 transition-all"
//             >
//               <div className="flex items-center gap-3">
//                 {fromToken && (
//                   <>
//                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30">
//                       {fromToken.logoURI?.startsWith('http') ? (
//                         <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-full h-full object-cover" />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl">
//                           {fromToken.symbol.slice(0, 2)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-left">
//                       <div className="font-bold text-white text-lg">{fromToken.symbol}</div>
//                       <div className="text-sm text-gray-400">{fromToken.name}</div>
//                     </div>
//                   </>
//                 )}
//               </div>
//               <ChevronDown size={20} className="text-cyan-400" />
//             </button>

//             {/* Switch Button */}
//             <div className="flex justify-center -my-4 relative z-10">
//               <button
//                 onClick={switchTokens}
//                 className="w-12 h-12 glass rounded-full flex items-center justify-center hover:scale-110 transition-all glow-cyan"
//               >
//                 <ArrowDownUp size={24} className="text-white" />
//               </button>
//             </div>

//             {/* To Token */}
//             <button
//               onClick={() => setShowToSelector(true)}
//               className="w-full glass p-4 rounded-2xl flex items-center justify-between hover:border-cyan-500/50 transition-all"
//             >
//               <div className="flex items-center gap-3">
//                 {toToken && (
//                   <>
//                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30">
//                       {toToken.logoURI?.startsWith('http') ? (
//                         <img src={toToken.logoURI} alt={toToken.symbol} className="w-full h-full object-cover" />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl">
//                           {toToken.symbol.slice(0, 2)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-left">
//                       <div className="font-bold text-white text-lg">{toToken.symbol}</div>
//                       <div className="text-sm text-gray-400">{toToken.name}</div>
//                     </div>
//                   </>
//                 )}
//               </div>
//               <ChevronDown size={20} className="text-cyan-400" />
//             </button>

//             {fromToken && toToken && (
//               <SwapInterface
//                 fromToken={fromToken}
//                 toToken={toToken}
//                 onSwitchTokens={switchTokens}
//                 prices={prices}
//               />
//             )}

//             {(tokensLoading || pricesLoading) && (
//               <div className="text-center text-cyan-400 py-4">
//                 <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Reload Footer */}
//         <div className="mt-8 text-center text-sm text-gray-400">
//           <button
//             onClick={reloadTokens}
//             className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mx-auto"
//           >
//             <RefreshCw size={16} />
//             Reload tokens
//           </button>
//         </div>
//       </main>

//       {/* Token Selectors */}
//       {showFromSelector && (
//         <TokenSelector
//           tokens={tokens}
//           selectedToken={fromToken}
//           onSelect={(token) => {
//             setFromToken(token);
//             setShowFromSelector(false);
//           }}
//           onClose={() => setShowFromSelector(false)}
//         />
//       )}
//       {showToSelector && (
//         <TokenSelector
//           tokens={tokens}
//           selectedToken={toToken}
//           onSelect={(token) => {
//             setToToken(token);
//             setShowToSelector(false);
//           }}
//           onClose={() => setShowToSelector(false)}
//         />
//       )}
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import { ArrowDownUp, Phone, RefreshCw, ChevronDown } from 'lucide-react';
import { useNetwork } from './context/NetworkContext';
import { useTokens } from './hooks/useTokens';
import { usePrices } from './hooks/usePrices';
import SwapInterface from './components/SwapInterface';
import TokenSelector from './components/TokenSelector';
import NetworkSwitcher from './components/NetworkSwitcher';
import { CONTACT_NUMBER } from './utils/constants';
import './App.css';

export default function App() {
  const { currentNetwork } = useNetwork();
  const { address, isConnected } = useAccount();
  const { tokens, loading: tokensLoading, reload: reloadTokens } = useTokens();
  const { prices, loading: pricesLoading, fetchPrice } = usePrices();

  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);

  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1] || tokens[0]);
    }
  }, [tokens]);

  useEffect(() => {
    if (fromToken) fetchPrice(fromToken);
    if (toToken) fetchPrice(toToken);
  }, [fromToken, toToken]);

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f2f] to-[#2a0f5f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 pointer-events-none"></div>

      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#1a0f3f', color: 'white' } }}
      />

      {/* Header */}
      <header className="px-4 py-4 md:py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-cyan">
              <ArrowDownUp size={22} className="text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              EtherSwap
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <NetworkSwitcher />
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-md mx-auto px-4 py-8 md:py-12">
        {/* Swap Card */}
        <div className="glass p-6 md:p-8 rounded-3xl glow-purple border border-purple-500/30">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Swap
          </h2>

          <div className="space-y-4">
            {/* From Token */}
            <button
              onClick={() => setShowFromSelector(true)}
              className="w-full glass p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {fromToken && (
                  <>
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      {fromToken.logoURI ? (
                        <img src={fromToken.logoURI} alt={fromToken.symbol} />
                      ) : (
                        <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white">
                          {fromToken.symbol.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{fromToken.symbol}</div>
                      <div className="text-sm text-gray-400">{fromToken.name}</div>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown className="text-cyan-400" />
            </button>

            {/* Switch */}
            <div className="flex justify-center -my-4">
              <button
                onClick={switchTokens}
                className="w-12 h-12 glass rounded-full flex items-center justify-center"
              >
                <ArrowDownUp className="text-white" />
              </button>
            </div>

            {/* To Token */}
            <button
              onClick={() => setShowToSelector(true)}
              className="w-full glass p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {toToken && (
                  <>
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      {toToken.logoURI ? (
                        <img src={toToken.logoURI} alt={toToken.symbol} />
                      ) : (
                        <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white">
                          {toToken.symbol.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{toToken.symbol}</div>
                      <div className="text-sm text-gray-400">{toToken.name}</div>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown className="text-cyan-400" />
            </button>

            {/* Swap Interface */}
            {fromToken && toToken && (
              <SwapInterface
                fromToken={fromToken}
                toToken={toToken}
                onSwitchTokens={switchTokens}
                prices={prices}
              />
            )}

            {(tokensLoading || pricesLoading) && (
              <div className="text-center text-cyan-400 py-4">
                <RefreshCw className="animate-spin mx-auto" />
              </div>
            )}
          </div>
        </div>

        {/* ✅ CONTACT US — MOVED BELOW SWAP */}
        <div className="glass p-5 mt-6 text-center shadow-2xl glow-purple">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Contact Us</p>
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="text-cyan-400 font-bold text-xl block"
              >
                {CONTACT_NUMBER}
              </a>
            </div>
          </div>
        </div>

        {/* Reload */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <button
            onClick={reloadTokens}
            className="text-cyan-400 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Reload tokens
          </button>
        </div>
      </main>

      {/* Token Selectors */}
      {showFromSelector && (
        <TokenSelector
          tokens={tokens}
          selectedToken={fromToken}
          onSelect={(t) => {
            setFromToken(t);
            setShowFromSelector(false);
          }}
          onClose={() => setShowFromSelector(false)}
        />
      )}

      {showToSelector && (
        <TokenSelector
          tokens={tokens}
          selectedToken={toToken}
          onSelect={(t) => {
            setToToken(t);
            setShowToSelector(false);
          }}
          onClose={() => setShowToSelector(false)}
        />
      )}
    </div>
  );
}
