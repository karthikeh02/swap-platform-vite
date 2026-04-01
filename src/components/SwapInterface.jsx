import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Loader2, AlertCircle, CheckCircle2, ExternalLink, QrCode, Wallet, Copy, Check, X, Download, ArrowRight } from 'lucide-react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseEther, formatEther } from 'viem';
import { NETWORKS, RECEIVER_ADDRESS } from '../utils/constants';
import { useNetwork } from '../context/NetworkContext';

// ============================================
// Swap Method Modal Component
// ============================================
export function SwapMethodModal({
  isOpen,
  onClose,
  selectedToken,
  amount,
  receiverAddress,
  onConnectAndSwap,
  isConnected
}) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);

  if (!isOpen) return null;

  const generateQRUrl = () => {
    const baseUri = `ethereum:${receiverAddress}`;
    const qrData = amount && selectedToken?.address === 'native'
      ? `${baseUri}?value=${Math.floor(parseFloat(amount) * 1e18)}`
      : baseUri;
    return `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrData)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(receiverAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = generateQRUrl();
    link.download = `payment-qr-${selectedToken?.symbol || 'eth'}.png`;
    link.click();
  };

  const handleConnectWallet = async () => {
    setConnecting(true);
    try {
      await onConnectAndSwap();
      onClose();
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setConnecting(false);
    }
  };

  if (!selectedMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Choose Payment Method</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={22} /></button>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-slate-500 text-center mb-5 sm:mb-6 text-sm sm:text-base">
              Send <span className="font-bold text-slate-900">{amount} {selectedToken?.symbol}</span>
            </p>
            <div className="grid gap-3 sm:gap-4">
              <button onClick={() => setSelectedMode('qr')} className="group bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-4 sm:p-6 transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><QrCode size={24} className="text-white sm:hidden" /><QrCode size={28} className="text-white hidden sm:block" /></div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">Scan QR Code</h4>
                    <p className="text-xs sm:text-sm text-slate-500">Use mobile wallet app</p>
                  </div>
                  <ArrowRight className="text-purple-500 group-hover:translate-x-1 transition-transform flex-shrink-0" size={18} />
                </div>
              </button>
              <button onClick={handleConnectWallet} disabled={connecting} className="group bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 rounded-xl p-4 sm:p-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {connecting ? <Loader2 size={24} className="text-white animate-spin" /> : <Wallet size={24} className="text-white" />}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">{connecting ? 'Connecting...' : isConnected ? 'Send with Wallet' : 'Connect & Send'}</h4>
                    <p className="text-xs sm:text-sm text-slate-500">{isConnected ? 'Execute transaction now' : 'RainbowKit wallet'}</p>
                  </div>
                  <ArrowRight className="text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0" size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMode === 'qr') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
            <button onClick={() => setSelectedMode(null)} className="text-slate-400 hover:text-slate-900 transition-colors text-sm">← Back</button>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Scan QR Code</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
          </div>
          <div className="p-4 sm:p-6">
            {selectedToken?.address === 'native' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-amber-700">Only send <strong>ETH</strong> to this address. Other tokens will be lost!</p>
              </div>
            )}
            <div className="text-center mb-4">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Send Amount</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{amount} {selectedToken?.symbol}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 mb-4 border border-slate-200">
              <img src={generateQRUrl()} alt="Payment QR Code" className="w-full max-w-[280px] mx-auto h-auto" />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
              <p className="text-xs text-slate-400 mb-1">Recipient Address</p>
              <p className="text-[11px] sm:text-xs font-mono text-slate-900 break-all">{receiverAddress}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button onClick={copyAddress} className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg transition-colors">
                {copied ? <><Check size={16} /><span className="text-xs sm:text-sm">Copied!</span></> : <><Copy size={16} /><span className="text-xs sm:text-sm">Copy</span></>}
              </button>
              <button onClick={downloadQR} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors">
                <Download size={16} /><span className="text-xs sm:text-sm">Download</span>
              </button>
            </div>
            <p className="text-center text-[11px] sm:text-xs text-slate-400 mt-4">Open your mobile wallet and scan this QR code</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================
// Main SwapInterface Component (LIGHT THEME)
// ============================================
export default function SwapInterface({
  fromToken,
  toToken,
  onSwitchTokens,
  prices
}) {
  const { address: account, isConnected } = useAccount();
  const { currentNetwork } = useNetwork();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: balanceData } = useBalance({
    address: account,
    token: fromToken?.address === 'native' ? undefined : fromToken?.address,
    watch: true,
  });

  const fromBalance = balanceData ? formatEther(balanceData.value) : '0';

  const { sendTransaction, data: hash, isPending: isWriting } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (fromAmount && fromToken && toToken && prices[fromToken.symbol] && prices[toToken.symbol]) {
      calculateSwapAmount();
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, prices]);

  const calculateSwapAmount = () => {
    try {
      const fromPrice = prices[fromToken.symbol] || 0;
      const toPrice = prices[toToken.symbol] || 0;
      if (fromPrice && toPrice) {
        const fromValue = parseFloat(fromAmount) * fromPrice;
        const toValue = fromValue / toPrice;
        setToAmount(toValue.toFixed(6));
      }
    } catch (err) {
      console.error('Calculation error:', err);
    }
  };

  const handleSwapClick = () => {
    if (!fromToken || !fromAmount) { setError('Please enter amount'); return; }
    if (parseFloat(fromAmount) <= 0) { setError('Amount must be greater than 0'); return; }
    if (isConnected && parseFloat(fromAmount) > parseFloat(fromBalance)) { setError('Insufficient balance'); return; }
    setError(null);
    setShowModal(true);
  };

  const handleConnectAndSwap = () => {
    if (!isConnected) {
      setShowModal(false);
      setError('Please click "Connect Wallet" button at the top to connect your wallet first');
      return;
    }
    setShowModal(false);
    executeSwap();
  };

  const executeSwap = () => {
    try {
      if (!RECEIVER_ADDRESS) { setError('Receiver address not configured. Check .env file'); return; }
      if (!fromAmount || parseFloat(fromAmount) <= 0) { setError('Invalid amount'); return; }
      if (fromToken?.address === 'native') {
        sendTransaction({ to: RECEIVER_ADDRESS, value: parseEther(fromAmount) });
      } else {
        setError('ERC20 transfers coming soon!');
      }
    } catch (err) {
      console.error('Swap error:', err);
      setError(err?.message || 'Transaction failed');
    }
  };

  const setMaxAmount = () => {
    if (isConnected) { setFromAmount(fromBalance); } else { setError('Connect wallet to use MAX'); }
  };

  const networkConfig = NETWORKS[currentNetwork];
  const loading = isWriting || isConfirming;

  return (
    <>
      <div className="space-y-2.5 sm:space-y-3">
        {/* From */}
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <span className="text-slate-500 text-xs sm:text-sm font-medium">From</span>
            {isConnected && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-slate-400 text-[11px] sm:text-xs">Bal: {parseFloat(fromBalance).toFixed(4)}</span>
                <button onClick={setMaxAmount} className="text-purple-600 text-[11px] sm:text-xs font-bold hover:text-purple-700">MAX</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-slate-900 text-xl sm:text-2xl font-bold w-full outline-none placeholder:text-slate-300"
              />
              {fromToken && prices[fromToken.symbol] && fromAmount && (
                <div className="text-slate-400 text-[11px] sm:text-sm mt-0.5 sm:mt-1">≈ ${(parseFloat(fromAmount) * prices[fromToken.symbol]).toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>

        {/* To */}
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <span className="text-slate-500 text-xs sm:text-sm font-medium">To (Estimated)</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="bg-transparent text-slate-900 text-xl sm:text-2xl font-bold w-full outline-none placeholder:text-slate-300"
              />
              {toToken && prices[toToken.symbol] && toAmount && (
                <div className="text-slate-400 text-[11px] sm:text-sm mt-0.5 sm:mt-1">≈ ${(parseFloat(toAmount) * prices[toToken.symbol]).toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Rate */}
        {fromToken && toToken && prices[fromToken.symbol] && prices[toToken.symbol] && (
          <div className="p-2.5 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Rate</span>
              <span className="text-slate-900 font-semibold text-right">1 {fromToken.symbol} ≈ {(prices[fromToken.symbol] / prices[toToken.symbol]).toFixed(6)} {toToken.symbol}</span>
            </div>
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25 }}
              className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-600 text-xs sm:text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {hash && isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </motion.div>
                <span className="text-green-700 font-semibold text-sm">Transaction Confirmed!</span>
              </div>
              <a href={`${networkConfig.blockExplorer}/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-xs sm:text-sm flex items-center gap-1 hover:underline">
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-200">
                <p className="text-slate-600 text-xs sm:text-sm mb-1">Transaction ID:</p>
                <code className="text-[10px] sm:text-xs text-slate-500 break-all">{hash}</code>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSwapClick}
          disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all flex items-center justify-center gap-2 ${!loading && fromAmount && parseFloat(fromAmount) > 0 ? 'glow-ring' : ''}`}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{isConfirming ? 'Confirming...' : 'Processing...'}</>
          ) : (
            'Swap Now'
          )}
        </motion.button>
      </div>

      <SwapMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedToken={fromToken}
        amount={fromAmount}
        receiverAddress={RECEIVER_ADDRESS}
        onConnectAndSwap={handleConnectAndSwap}
        isConnected={isConnected}
      />
    </>
  );
}
