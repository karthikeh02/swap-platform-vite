import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function Section({ title, children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false, margin: '-40px' }} transition={{ duration: 0.4 }} className="mb-10">
      <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-500 leading-relaxed space-y-3 text-[15px]">{children}</div>
    </motion.div>
  );
}

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-10 sm:py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10 sm:mb-14">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-purple-600 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-200">
          <FileText size={24} className="text-white sm:hidden" />
          <FileText size={30} className="text-white hidden sm:block" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3">Terms & Conditions</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Last updated: March 2026</p>
      </motion.div>

      <div className="card p-5 sm:p-8 md:p-12">
        <Section title="1. Acceptance of Terms">
          <p>By accessing or using EtherSwap, you agree to be bound by these Terms and Conditions. If you do not agree, you must not use the platform.</p>
        </Section>
        <Section title="2. Description of Service">
          <p>EtherSwap is a decentralized token swap platform that facilitates the exchange of cryptocurrency tokens on the Ethereum mainnet.</p>
        </Section>
        <Section title="3. Eligibility">
          <p>You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use EtherSwap.</p>
        </Section>
        <Section title="4. Wallet & Account Responsibility">
          <p>You are solely responsible for maintaining the security of your cryptocurrency wallet, including your private keys and seed phrases. EtherSwap does not store or have access to your private keys.</p>
        </Section>
        <Section title="5. Risks & Disclaimers">
          <p>Cryptocurrency trading involves significant financial risk. You acknowledge:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-500">
            <li>Cryptocurrency prices are highly volatile</li>
            <li>Blockchain transactions are irreversible once confirmed</li>
            <li>Network congestion may cause delays</li>
            <li>Smart contract interactions carry inherent risks</li>
            <li>Gas fees are determined by the network</li>
          </ul>
        </Section>
        <Section title="6. No Financial Advice">
          <p>EtherSwap does not provide financial, investment, tax, or legal advice. All information is for informational purposes only.</p>
        </Section>
        <Section title="7. Limitation of Liability">
          <p>To the maximum extent permitted by law, EtherSwap shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform.</p>
        </Section>
        <Section title="8. Prohibited Activities">
          <p>You agree not to use EtherSwap for:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-500">
            <li>Money laundering or terrorist financing</li>
            <li>Any activity violating applicable laws</li>
            <li>Market manipulation or fraud</li>
            <li>Interfering with platform security</li>
          </ul>
        </Section>
        <Section title="9. Intellectual Property">
          <p>All content, trademarks, and intellectual property on EtherSwap are the property of EtherSwap or its licensors.</p>
        </Section>
        <Section title="10. Modifications">
          <p>We reserve the right to modify these Terms at any time. Your continued use constitutes acceptance of the updated terms.</p>
        </Section>
        <Section title="11. Governing Law">
          <p>These Terms shall be governed by and construed in accordance with applicable laws.</p>
        </Section>
        <Section title="12. Contact">
          <p>If you have any questions, please contact us through the information provided on our platform.</p>
        </Section>
      </div>
    </div>
  );
}
