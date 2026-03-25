import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function TokenSelector({ tokens, selectedToken, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(tokens);

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
  }, [search, tokens]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden glow-purple border border-purple-500/30">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">Select Token</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, symbol or address"
              className="w-full bg-gray-900/50 text-white pl-12 pr-6 py-4 rounded-2xl outline-none border border-purple-500/30 focus:border-purple-400 transition-all placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-lg">No tokens found</div>
              <div className="text-gray-600 text-sm mt-2">Try a different search term</div>
            </div>
          ) : (
            <div className="p-2">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onSelect(token);
                    onClose();
                  }}
                  className="w-full p-4 flex items-center gap-4 hover:bg-purple-900/30 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-purple-500/30 flex-shrink-0">
                    {token.logoURI && token.logoURI.startsWith('http') ? (
                      <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg ${token.logoURI && token.logoURI.startsWith('http') ? 'hidden' : 'flex'}`}>
                      {token.symbol.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="text-white font-bold text-lg">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>

                  {selectedToken?.address === token.address && (
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}