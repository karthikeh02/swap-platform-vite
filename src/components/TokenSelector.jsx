import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

function buildLogoUrls(token) {
  const urls = [];
  if (token.logoURI && token.logoURI.startsWith('http')) {
    urls.push(token.logoURI);
  }
  if (token.address && token.address.startsWith('0x')) {
    urls.push(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`);
  }
  if (token.logoURI && token.logoURI.includes('assets.coingecko.com')) {
    urls.push(token.logoURI.replace('assets.coingecko.com', 'coin-images.coingecko.com'));
  }
  return [...new Set(urls)];
}

function TokenIcon({ token }) {
  const [attempt, setAttempt] = useState(0);
  const urls = buildLogoUrls(token);

  useEffect(() => {
    setAttempt(0);
  }, [token.address, token.logoURI]);

  if (attempt < urls.length) {
    return (
      <img
        key={urls[attempt]}
        src={urls[attempt]}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setAttempt(prev => prev + 1)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
      {token.symbol.slice(0, 2).toUpperCase()}
    </div>
  );
}

const BATCH_SIZE = 40;

export default function TokenSelector({ tokens, selectedToken, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const listRef = useRef(null);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!search) {
      setFilteredTokens(tokens);
    } else {
      const query = search.toLowerCase();
      setFilteredTokens(
        tokens.filter(token =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase() === query
        )
      );
    }
    setVisibleCount(BATCH_SIZE);
  }, [search, tokens]);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setVisibleCount(prev => {
        if (prev >= filteredTokens.length) return prev;
        return prev + BATCH_SIZE;
      });
    }
  }, [filteredTokens.length]);

  const displayedTokens = filteredTokens.slice(0, visibleCount);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 py-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Select Token</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 sm:p-6 border-b border-slate-100">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, symbol or address"
                aria-label="Search tokens by name, symbol or address"
                className="w-full bg-slate-50 text-slate-900 pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder-slate-400 text-sm sm:text-base"
                autoFocus
              />
            </motion.div>
          </div>

          {/* Token List */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overscroll-contain"
          >
            {tokens.length === 0 ? (
              <div className="p-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-20" />
                      <div className="skeleton h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTokens.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 text-center"
              >
                <div className="text-slate-500 text-base sm:text-lg">No tokens found</div>
                <div className="text-slate-400 text-xs sm:text-sm mt-2">Try a different search term</div>
              </motion.div>
            ) : (
              <div className="p-1.5 sm:p-2">
                {displayedTokens.map((token, index) => (
                  <motion.button
                    key={token.address}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    whileTap={{ scale: 0.98, backgroundColor: 'rgba(147, 51, 234, 0.08)' }}
                    onClick={() => {
                      onSelect(token);
                      onClose();
                    }}
                    className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-purple-50 active:bg-purple-100 rounded-xl sm:rounded-2xl transition-colors group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0"
                    >
                      <TokenIcon token={token} />
                    </motion.div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="text-slate-900 font-bold text-base sm:text-lg">{token.symbol}</div>
                      <div className="text-slate-500 text-xs sm:text-sm truncate">{token.name}</div>
                    </div>

                    {selectedToken?.address === token.address && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full flex-shrink-0 glow-ring"
                      />
                    )}
                  </motion.button>
                ))}
                {visibleCount < filteredTokens.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-3 text-slate-400 text-xs"
                  >
                    Scroll for more tokens...
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { TokenIcon };
