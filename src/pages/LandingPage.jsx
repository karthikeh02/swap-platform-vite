import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import {
  ArrowRight, Zap, Shield, Globe, Wallet, Repeat, CheckCircle,
  Lock, BarChart3, Clock, Eye, ChevronDown, ChevronUp, Layers,
  TrendingUp, Users, ArrowDownUp, Star, ShieldCheck, Search,
  Activity, Phone, RefreshCw,
} from 'lucide-react';
import { useTokens } from '../hooks/useTokens';
import { usePrices } from '../hooks/usePrices';
import SwapInterface from '../components/SwapInterface';
import TokenSelector from '../components/TokenSelector';
import { CONTACT_NUMBER } from '../utils/constants';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };

function SectionHeader({ badge, title, subtitle }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }} className="text-center mb-14">
      {badge && <span className="badge mb-5 inline-block">{badge}</span>}
      <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-slate-800 font-semibold text-[15px] md:text-base pr-4 group-hover:text-purple-600 transition-colors">{q}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
        <p className="text-slate-500 text-sm leading-relaxed pb-5 pr-12">{a}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D Floating Tokens (visible on ALL screen sizes) ─── */
function FloatingTokens() {
  const tokens = [
    { src: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', anim: 'float-anim-1', delay: '0s' },
    { src: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', anim: 'float-anim-2', delay: '0.5s' },
    { src: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', anim: 'float-anim-3', delay: '1s' },
    { src: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png', anim: 'float-anim-4', delay: '0.3s' },
    { src: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png', anim: 'float-anim-2', delay: '1.5s', blur: true },
    { src: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', anim: 'float-anim-1', delay: '0.8s', blur: true },
    { src: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', anim: 'float-anim-3', delay: '2s' },
    { src: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png', anim: 'float-anim-4', delay: '1.2s', blur: true },
  ];

  return (
    <div className="absolute inset-0 floating-tokens-container pointer-events-none overflow-hidden" aria-hidden="true">
      {tokens.map((t, i) => (
        <div
          key={i}
          className={`floating-token ft-${i} ${t.anim}`}
          style={{
            animationDelay: t.delay,
            filter: t.blur ? 'blur(1.5px)' : 'none',
          }}
        >
          <img src={t.src} alt="" className="w-full h-full rounded-full shadow-lg" draggable={false} />
        </div>
      ))}
    </div>
  );
}

/* ─── Swap Card (embedded in hero) ─── */
function HeroSwapCard() {
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
    <>
      <div className="hero-animate hero-animate-d3 w-full max-w-[420px] p-6 md:p-7 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-purple-900/5">
        <h2 className="text-xl font-extrabold text-center mb-5 text-slate-900">Swap Tokens</h2>

        <div className="space-y-3">
          {/* From Token */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowFromSelector(true)}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {fromToken && (
                <>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                    {fromToken.logoURI?.startsWith('http') ? (
                      <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">{fromToken.symbol.slice(0, 2)}</div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">{fromToken.symbol}</div>
                    <div className="text-xs text-slate-400">{fromToken.name}</div>
                  </div>
                </>
              )}
            </div>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.button>

          {/* Switch */}
          <div className="flex justify-center -my-1 relative z-10">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={switchTokens}
              className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
            >
              <ArrowDownUp size={18} className="text-white" />
            </motion.button>
          </div>

          {/* To Token */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowToSelector(true)}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {toToken && (
                <>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                    {toToken.logoURI?.startsWith('http') ? (
                      <img src={toToken.logoURI} alt={toToken.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">{toToken.symbol.slice(0, 2)}</div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">{toToken.symbol}</div>
                    <div className="text-xs text-slate-400">{toToken.name}</div>
                  </div>
                </>
              )}
            </div>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.button>

          {fromToken && toToken && (
            <SwapInterface fromToken={fromToken} toToken={toToken} onSwitchTokens={switchTokens} prices={prices} />
          )}

          {(tokensLoading || pricesLoading) && (
            <div className="text-center text-purple-500 py-4"><RefreshCw className="w-5 h-5 animate-spin mx-auto" /></div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button onClick={reloadTokens} className="text-slate-400 hover:text-purple-600 text-xs flex items-center gap-1.5 mx-auto transition-colors">
            <RefreshCw size={12} /> Reload tokens
          </button>
        </div>
      </div>

      {/* Token Selectors */}
      {showFromSelector && (
        <TokenSelector tokens={tokens} selectedToken={fromToken} onSelect={(t) => { setFromToken(t); setShowFromSelector(false); }} onClose={() => setShowFromSelector(false)} />
      )}
      {showToSelector && (
        <TokenSelector tokens={tokens} selectedToken={toToken} onSelect={(t) => { setToToken(t); setShowToSelector(false); }} onClose={() => setShowToSelector(false)} />
      )}
    </>
  );
}

export default function LandingPage() {
  const features = [
    { icon: <Globe size={22} />, title: 'Multi-Chain Ready', desc: 'Built to support Ethereum mainnet with multi-chain expansion on the way.', border: 'card-purple', iconBg: 'bg-purple-100 text-purple-600' },
    { icon: <BarChart3 size={22} />, title: 'Real-Time Pricing', desc: 'Aggregated price feeds from 5+ sources including CoinGecko, Binance, and Uniswap.', border: 'card-green', iconBg: 'bg-green-100 text-green-600' },
    { icon: <Shield size={22} />, title: 'Non-Custodial', desc: 'Your keys, your crypto. We never access your private keys or seed phrases.', border: 'card-blue', iconBg: 'bg-blue-100 text-blue-600' },
    { icon: <Zap size={22} />, title: 'Instant Execution', desc: 'Transactions submitted directly to the blockchain for fastest confirmation.', border: 'card-amber', iconBg: 'bg-amber-100 text-amber-600' },
    { icon: <Eye size={22} />, title: 'Full Transparency', desc: 'Every transaction is verifiable on-chain with direct Etherscan links.', border: 'card-pink', iconBg: 'bg-pink-100 text-pink-600' },
    { icon: <Layers size={22} />, title: '500+ Tokens', desc: 'Hundreds of tokens from curated and verified token lists on Ethereum.', border: 'card-cyan', iconBg: 'bg-cyan-100 text-cyan-600' },
  ];

  const steps = [
    { num: '01', icon: <Wallet size={22} />, title: 'Connect Your Wallet', desc: 'Link MetaMask or any WalletConnect-compatible wallet.', color: 'text-purple-600 bg-purple-100' },
    { num: '02', icon: <Search size={22} />, title: 'Select Your Tokens', desc: 'Search and select from hundreds of ERC-20 tokens.', color: 'text-green-600 bg-green-100' },
    { num: '03', icon: <Activity size={22} />, title: 'Review & Confirm', desc: 'Check the exchange rate and confirm on-chain.', color: 'text-blue-600 bg-blue-100' },
    { num: '04', icon: <CheckCircle size={22} />, title: 'Swap Complete', desc: 'Tokens arrive in seconds. Track on Etherscan.', color: 'text-emerald-600 bg-emerald-100' },
  ];

  const security = [
    { icon: <Lock size={22} />, title: 'Non-Custodial Architecture', desc: 'We never hold your funds or private keys. Every transaction is initiated and signed by you.' },
    { icon: <ShieldCheck size={22} />, title: 'Zero-Knowledge Privacy', desc: 'We never collect, track, or monitor personal data such as IP addresses or wallet balances.' },
    { icon: <Activity size={22} />, title: 'On-Chain Verification', desc: 'Every swap is transparent and verifiable on Ethereum mainnet via Etherscan.' },
  ];

  const testimonials = [
    { name: 'Alex M.', role: 'DeFi Trader', text: 'The multi-source pricing is a game changer. I always get the best rates and the interface is incredibly smooth.', color: 'bg-purple-100 text-purple-600' },
    { name: 'Sarah K.', role: 'Crypto Investor', text: 'Love how transparent everything is. Verifying every swap on Etherscan gives me total peace of mind.', color: 'bg-green-100 text-green-600' },
    { name: 'David R.', role: 'Web3 Developer', text: 'Non-custodial and zero fees. This is what DeFi should be. The WalletConnect integration works flawlessly.', color: 'bg-blue-100 text-blue-600' },
  ];

  const faqs = [
    { q: 'Is EtherSwap free to use?', a: 'EtherSwap charges zero platform fees. You only pay standard Ethereum gas fees for your transaction.' },
    { q: 'Which wallets are supported?', a: 'We support MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and many more through RainbowKit.' },
    { q: 'How are token prices determined?', a: 'We aggregate prices from 5+ sources including CoinGecko, CryptoCompare, Binance, Coinbase, and on-chain DEX data.' },
    { q: 'Is my crypto safe?', a: 'Absolutely. EtherSwap is non-custodial — we never access your private keys or funds. All transactions happen directly on Ethereum.' },
    { q: 'Which network is supported?', a: 'We currently support Ethereum mainnet. Additional networks will be added in future updates.' },
    { q: 'How do I get started?', a: 'Simply connect your wallet on this page, select your tokens, and swap. No account creation needed.' },
  ];

  return (
    <div className="relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '16px', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } }} />

      {/* ═══ HERO + SWAP ═══ */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <div>
              <div className="hero-animate hero-animate-d1">
                <span className="badge mb-6 inline-flex">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  LIVE ON ETHEREUM MAINNET
                </span>
              </div>

              <h1 className="hero-animate hero-animate-d2 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-slate-900 mb-6">
                Swap Tokens{' '}
                <span className="text-purple-600">Instantly</span>{' '}
                on Ethereum
              </h1>

              <p className="hero-animate hero-animate-d3 text-slate-500 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
                The fastest way to exchange ERC-20 tokens with real-time pricing
                from 5+ sources. Non-custodial. Zero platform fees.
              </p>

              {/* Trust bar */}
              <div className="hero-animate hero-animate-d4 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />Available 24/7</span>
                <span className="text-slate-300">&#9670;</span>
                <span>Non-Custodial</span>
                <span className="text-slate-300">&#9670;</span>
                <span>Zero Fees</span>
              </div>

              {/* Contact */}
              {CONTACT_NUMBER && (
                <div className="hero-animate hero-animate-d5 mt-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Need Help?</p>
                    <a href={`tel:${CONTACT_NUMBER}`} className="text-purple-600 hover:text-purple-700 font-bold text-lg transition-colors">{CONTACT_NUMBER}</a>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Swap Card + 3D Floating Tokens */}
            <div className="flex justify-center lg:justify-end relative">
              <FloatingTokens />
              <HeroSwapCard />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 px-4 bg-section-light border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Tokens Available' },
              { value: '5+', label: 'Price Sources' },
              { value: '0%', label: 'Platform Fees' },
              { value: '24/7', label: 'Availability' },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">{s.value}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="OUR FEATURES" title={<>A Unified Platform for <span className="text-purple-600">All Your Swaps</span></>} subtitle="From real-time pricing to non-custodial security — everything you need." />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }} className={`card ${f.border} p-7`}>
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 px-4 bg-section-light">
        <div className="max-w-5xl mx-auto">
          <SectionHeader badge="HOW IT WORKS" title={<>Your Swap in <span className="text-purple-600">4 Simple Steps</span></>} subtitle="From wallet connection to completed swap — it only takes seconds." />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <motion.div key={step.num} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }} className="card p-7 text-center card-purple">
                <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4 text-sm font-bold`}>{step.num}</div>
                <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-4`}>{step.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SECURITY ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="badge mb-5 inline-block">SECURITY</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Your Assets Are <span className="text-purple-600">Always</span> Under Your Control</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">EtherSwap is built with security-first principles. We never hold your funds and every transaction is transparent on Ethereum.</p>
              <div className="space-y-6">
                {security.map((s) => (
                  <motion.div key={s.title} whileHover={{ x: 4 }} className="flex gap-4 p-5 rounded-xl border border-slate-100 hover:border-purple-200 hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{s.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-100 to-blue-50 rounded-3xl blur-2xl opacity-60" />
                <div className="relative bg-white border border-slate-200 rounded-3xl p-10 shadow-lg">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-600 flex items-center justify-center mb-6"><Shield size={40} className="text-white" /></div>
                  <h3 className="text-xl font-bold text-center text-slate-900 mb-3">100% Non-Custodial</h3>
                  <p className="text-slate-500 text-center text-sm leading-relaxed mb-6">Your wallet, your keys, your control.</p>
                  <div className="space-y-3">
                    {['Direct on-chain swaps', 'No account required', 'Ethereum mainnet only', 'Multi-wallet support'].map((item) => (
                      <div key={item} className="flex items-center gap-3"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /><span className="text-slate-600 text-sm">{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 px-4 bg-section-light">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="TESTIMONIALS" title={<>Trusted by <span className="text-purple-600">Traders Worldwide</span></>} />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} transition={{ duration: 0.5 }} whileHover={{ y: -4 }} className="card p-7">
                <div className="text-purple-200 text-4xl font-serif mb-3">"</div>
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map((s) => <Star key={s} size={16} className="fill-amber-400 text-amber-400" />)}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm`}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div className="font-semibold text-slate-900 text-sm">{t.name}</div><div className="text-slate-400 text-xs">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader badge="FAQ" title={<>Frequently Asked <span className="text-purple-600">Questions</span></>} />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="card p-8 md:p-10">
            {faqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 px-4 bg-section-light">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
          <div className="relative p-14 md:p-20 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', duration: 0.6 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
              ><ArrowDownUp size={30} className="text-white" /></motion.div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5">Ready to Swap?</h2>
              <p className="text-purple-200 mb-10 text-lg max-w-xl mx-auto">Scroll up and start swapping tokens right now. No sign-up required.</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-purple-700 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-3 mx-auto"
              >Swap Now <ArrowRight size={20} /></motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
