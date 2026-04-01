import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ArrowDownUp, Phone, RefreshCw, ChevronDown } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';
import { useTokens } from '../hooks/useTokens';
import { usePrices } from '../hooks/usePrices';
import SwapInterface from '../components/SwapInterface';
import TokenSelector from '../components/TokenSelector';
import { TokenIcon } from '../components/TokenSelector';
import { CONTACT_NUMBER } from '../utils/constants';

export default function SwapPage() {
  const { currentNetwork } = useNetwork();
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
    <div className="relative min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-72px)]">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-100/50 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      />

      <main className="max-w-[420px] mx-auto px-3 sm:px-4 py-8 sm:py-14 md:py-20 relative z-10">
        {/* Swap Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xl shadow-purple-900/5"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-5 sm:mb-7 text-slate-900">Swap</h2>

          <div className="space-y-2.5 sm:space-y-3">
            {/* From Token */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowFromSelector(true)}
              className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-all duration-200 active:bg-slate-100"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {fromToken && (
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <TokenIcon token={fromToken} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{fromToken.symbol}</div>
                      <div className="text-[11px] sm:text-xs text-slate-400 truncate">{fromToken.name}</div>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
            </motion.button>

            {/* Switch */}
            <div className="flex justify-center -my-0.5 sm:-my-1 relative z-10">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={switchTokens}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-purple-600 flex items-center justify-center shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
              >
                <ArrowDownUp size={16} className="text-white sm:hidden" />
                <ArrowDownUp size={18} className="text-white hidden sm:block" />
              </motion.button>
            </div>

            {/* To Token */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowToSelector(true)}
              className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-all duration-200 active:bg-slate-100"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {toToken && (
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <TokenIcon token={toToken} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{toToken.symbol}</div>
                      <div className="text-[11px] sm:text-xs text-slate-400 truncate">{toToken.name}</div>
                    </div>
                  </>
                )}
              </div>
              <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
            </motion.button>

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
              <div className="text-center text-purple-500 py-3 sm:py-4">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-sm text-center"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Phone size={16} className="text-white" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm sm:text-base">Contact Us</p>
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="text-purple-600 hover:text-purple-700 font-bold text-base sm:text-lg transition-colors"
              >
                {CONTACT_NUMBER}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Reload */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={reloadTokens}
            className="text-slate-400 hover:text-purple-600 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mx-auto transition-colors"
          >
            <RefreshCw size={12} />
            Reload tokens
          </button>
        </div>
      </main>

      {/* Token Selectors */}
      {showFromSelector && (
        <TokenSelector
          tokens={tokens}
          selectedToken={fromToken}
          onSelect={(t) => { setFromToken(t); setShowFromSelector(false); }}
          onClose={() => setShowFromSelector(false)}
        />
      )}
      {showToSelector && (
        <TokenSelector
          tokens={tokens}
          selectedToken={toToken}
          onSelect={(t) => { setToToken(t); setShowToSelector(false); }}
          onClose={() => setShowToSelector(false)}
        />
      )}
    </div>
  );
}
