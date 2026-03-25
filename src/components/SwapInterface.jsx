import { useState, useEffect } from 'react';
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

  // Initial choice screen
  if (!selectedMode) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Choose Payment Method</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 text-center mb-6">
              Send <span className="font-bold text-white">{amount} {selectedToken?.symbol}</span>
            </p>

            <div className="grid gap-4">
              {/* QR Code Option */}
              <button
                onClick={() => setSelectedMode('qr')}
                className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-2 border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <QrCode size={28} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">Scan QR Code</h4>
                    <p className="text-sm text-gray-300">Use mobile wallet app</p>
                  </div>
                  <ArrowRight className="text-purple-400 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </button>

              {/* Connect Wallet Option */}
              <button
                onClick={handleConnectWallet}
                disabled={connecting}
                className="group bg-gradient-to-br from-orange-500/20 to-yellow-500/20 hover:from-orange-500/30 hover:to-yellow-500/30 border-2 border-orange-500/50 hover:border-orange-400 rounded-xl p-6 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {connecting ? (
                      <Loader2 size={28} className="text-white animate-spin" />
                    ) : (
                      <Wallet size={28} className="text-white" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">
                      {connecting ? 'Connecting...' : isConnected ? 'Send with Wallet' : 'Connect & Send'}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {isConnected ? 'Execute transaction now' : 'RainbowKit wallet'}
                    </p>
                  </div>
                  <ArrowRight className="text-orange-400 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QR Code Screen
  if (selectedMode === 'qr') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-lg font-bold text-white">Scan QR Code</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning for ETH only */}
            {selectedToken?.address === 'native' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-yellow-200">
                  Only send <strong>ETH</strong> to this address. Other tokens will be lost!
                </p>
              </div>
            )}

            {/* Amount Display */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm mb-1">Send Amount</p>
              <p className="text-2xl font-bold text-white">
                {amount} {selectedToken?.symbol}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <img
                src={generateQRUrl()}
                alt="Payment QR Code"
                className="w-full h-auto"
              />
            </div>

            {/* Address */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400 mb-1">Recipient Address</p>
              <p className="text-xs font-mono text-white break-all">{receiverAddress}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyAddress}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span className="text-sm">Download</span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Open your mobile wallet and scan this QR code
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================
// Main SwapInterface Component
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

  // Get balance using wagmi hook
  const { data: balanceData } = useBalance({
    address: account,
    token: fromToken?.address === 'native' ? undefined : fromToken?.address,
    watch: true,
  });

  const fromBalance = balanceData ? formatEther(balanceData.value) : '0';

  // Transaction hooks - FIXED: Use useSendTransaction for native ETH
  const { sendTransaction, data: hash, isPending: isWriting } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

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
    if (!fromToken || !fromAmount) {
      setError('Please enter amount');
      return;
    }

    if (parseFloat(fromAmount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (isConnected && parseFloat(fromAmount) > parseFloat(fromBalance)) {
      setError('Insufficient balance');
      return;
    }

    setError(null);
    setShowModal(true);
  };

  const handleConnectAndSwap = () => {
    console.log('handleConnectAndSwap called, isConnected:', isConnected);
    
    if (!isConnected) {
      // User needs to connect wallet first - show error
      setShowModal(false);
      setError('Please click "Connect Wallet" button at the top to connect your wallet first');
      return;
    }

    // If already connected, execute swap immediately
    console.log('User is connected, executing swap...');
    setShowModal(false);
    executeSwap();
  };

  const executeSwap = () => {
    try {
      console.log('=== EXECUTING SWAP ===');
      console.log('Receiver Address:', RECEIVER_ADDRESS);
      console.log('Amount:', fromAmount);
      console.log('From Token:', fromToken);
      console.log('Is Connected:', isConnected);
      console.log('Account:', account);
      
      if (!RECEIVER_ADDRESS) {
        const errorMsg = 'Receiver address not configured. Check .env file for VITE_RECEIVER_ADDRESS';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setError('Invalid amount');
        return;
      }

      if (fromToken?.address === 'native') {
        console.log('Sending native ETH transaction...');
        console.log('Calling sendTransaction with:', {
          to: RECEIVER_ADDRESS,
          value: parseEther(fromAmount).toString()
        });
        
        // Send ETH transaction
        sendTransaction({
          to: RECEIVER_ADDRESS,
          value: parseEther(fromAmount),
        });
        
        console.log('sendTransaction called successfully');
      } else {
        // Send ERC20 token (requires token contract ABI)
        console.warn('ERC20 transfers not yet implemented');
        setError('ERC20 transfers coming soon!');
      }
    } catch (err) {
      console.error('Swap error:', err);
      setError(err?.message || 'Transaction failed');
    }
  };

  const setMaxAmount = () => {
    if (isConnected) {
      setFromAmount(fromBalance);
    } else {
      setError('Connect wallet to use MAX');
    }
  };

  const networkConfig = NETWORKS[currentNetwork];
  const loading = isWriting || isConfirming;

  return (
    <>
      <div className="space-y-2">
        <div className="bg-gray-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">From</span>
            {isConnected && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">
                  Balance: {parseFloat(fromBalance).toFixed(6)}
                </span>
                <button
                  onClick={setMaxAmount}
                  className="text-blue-400 text-xs font-semibold hover:text-blue-300"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="bg-transparent text-white text-2xl font-bold w-full outline-none"
              />
              {fromToken && prices[fromToken.symbol] && fromAmount && (
                <div className="text-gray-400 text-sm mt-1">
                  ≈ ${(parseFloat(fromAmount) * prices[fromToken.symbol]).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={onSwitchTokens}
            className="bg-gray-800 hover:bg-gray-700 border-4 border-gray-900 rounded-xl p-2 transition-all"
          >
            <ArrowDownUp className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">To (Estimated)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="bg-transparent text-white text-2xl font-bold w-full outline-none"
              />
              {toToken && prices[toToken.symbol] && toAmount && (
                <div className="text-gray-400 text-sm mt-1">
                  ≈ ${(parseFloat(toAmount) * prices[toToken.symbol]).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {fromToken && toToken && prices[fromToken.symbol] && prices[toToken.symbol] && (
          <div className="p-3 bg-gray-800/30 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-white font-medium">
                1 {fromToken.symbol} ≈ {(prices[fromToken.symbol] / prices[toToken.symbol]).toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {hash && isSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Transaction Confirmed!</span>
            </div>
            <a
              href={`${networkConfig.blockExplorer}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm flex items-center gap-1 hover:underline"
            >
              View on Explorer <ExternalLink className="w-3 h-3" />
            </a>
            <div className="mt-3 pt-3 border-t border-green-500/20">
              <p className="text-gray-300 text-sm mb-1">📋 Transaction ID:</p>
              <code className="text-xs text-gray-400 break-all">{hash}</code>
            </div>
          </div>
        )}

        <button
          onClick={handleSwapClick}
          disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Processing...'}
            </>
          ) : (
            'Swap Now'
          )}
        </button>
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