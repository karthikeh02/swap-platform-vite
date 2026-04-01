import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function Section({ title, children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }} className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-500 leading-relaxed space-y-3 text-[15px]">{children}</div>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-10 sm:py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10 sm:mb-14">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-purple-600 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-200">
          <Shield size={24} className="text-white sm:hidden" />
          <Shield size={30} className="text-white hidden sm:block" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3">Privacy Policy</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Last updated: March 2026</p>
      </motion.div>

      <div className="card p-5 sm:p-8 md:p-12">
        <Section title="1. Introduction">
          <p>Welcome to EtherSwap. We are committed to protecting your privacy and ensuring transparency about how we handle your data. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal data.</p>
        </Section>
        <Section title="2. Information We Collect">
          <p><strong className="text-slate-700">Wallet Information:</strong> When you connect your cryptocurrency wallet, we access your public wallet address. We do not have access to your private keys or seed phrases.</p>
          <p><strong className="text-slate-700">Transaction Data:</strong> We record transaction details such as token types, amounts, network used, and transaction hashes for the purpose of facilitating swaps.</p>
          <p><strong className="text-slate-700">Usage Data:</strong> We may collect anonymized analytics data including pages visited, features used, and device/browser information to improve our service.</p>
        </Section>
        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-500">
            <li>Facilitate token swap transactions</li>
            <li>Display accurate pricing and token balances</li>
            <li>Improve our platform and user experience</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with applicable legal obligations</li>
          </ul>
        </Section>
        <Section title="4. Cookies & Tracking">
          <p>EtherSwap may use essential cookies to maintain your session preferences such as selected network and theme. We do not use third-party advertising cookies.</p>
        </Section>
        <Section title="5. Third-Party Services">
          <p>We integrate with third-party services to provide our platform functionality:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-500">
            <li>WalletConnect for wallet connections</li>
            <li>CoinGecko, CryptoCompare, and other APIs for price data</li>
            <li>Ethereum and other blockchain networks for transaction processing</li>
          </ul>
        </Section>
        <Section title="6. Data Security">
          <p>We implement industry-standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
        </Section>
        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-500">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Disconnect your wallet at any time</li>
          </ul>
        </Section>
        <Section title="8. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
        </Section>
        <Section title="9. Contact Us">
          <p>If you have any questions about this Privacy Policy, please reach out through the contact information provided on our platform.</p>
        </Section>
      </div>
    </div>
  );
}
