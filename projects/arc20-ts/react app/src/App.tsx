import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Zap, Github, Twitter, Lock } from 'lucide-react';
import { Wallet as WalletComponent } from './components/Wallet';
import { AsaInfo } from './components/AsaInfo';
import { AsaTransfer } from './components/AsaTransfer';
import { BalanceDisplay } from './components/BalanceDisplay';
import { OptInButton } from './components/OptInButton';
import { OptInStatus } from './components/OptInStatus';
import { TransactionHistory } from './components/TransactionHistory';
import { AsaInput } from './components/AsaInput';
import { ClawbackTransfer } from './components/ClawbackTransfer';
import { DestroyAsa } from './components/DestroyAsa';
import './App.css';

import { FC } from 'react';

type FeatureCardProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  gradient: string;
};

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => (
  <div className={`feature-card ${gradient}`}>
    <div className="feature-icon">
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

type SectionCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = "" }) => (
  <div className={`section-card ${className}`}>
    <h3 className="section-title">
      {title}
    </h3>
    <div className="section-content">
      {children}
    </div>
  </div>
);

function App() {
  const [address, setAddress] = useState('');
  const [asaId, setAsaId] = useState('');
  const [isClawback, setIsClawback] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [, setManagerAddress] = useState('');

  const parsedAsaId = parseInt(asaId);

  useEffect(() => {
    async function fetchManager() {
      if (!parsedAsaId || !address) {
        setIsManager(false);
        setManagerAddress('');
        return;
      }
      try {
        // Fetch ASA info to get manager address
        const algod = new (await import('algosdk')).Algodv2('', 'https://testnet-api.algonode.cloud', '');
        const asset = await algod.getAssetByID(parsedAsaId).do();
        setManagerAddress(asset.params.manager);
        setIsManager(asset.params.manager === address);
      } catch {
        setIsManager(false);
        setManagerAddress('');
      }
    }
    fetchManager();
  }, [parsedAsaId, address]);

  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Built on Algorand's secure and fast blockchain infrastructure",
      gradient: "from-blue-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience near-instant transaction confirmations",
      gradient: "from-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your ASA tokens with comprehensive analytics",
      gradient: "from-green-600"
    }
  ];

  const showDashboard = address && !isNaN(parsedAsaId);

  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div className="bg-animations">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <div className="logo-icon">
              <Wallet size={32} className="text-white" />
            </div>
            <h1 className="main-title">
              ARC 20 TS
            </h1>
          </div>
          <p className="subtitle">
            Your comprehensive dashboard for managing Algorand Standard Assets with TypeScript precision
          </p>
          <div className="social-links">
            <button
              className="social-link"
              onClick={() => window.open('https://github.com/lhcee3/arc20-ts', '_blank')}
              title="View on GitHub"
            >
              <Github size={20} className="text-white" />
            </button>
            <a
              href="https://x.com/lhcee3"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="View on X (Twitter)"
            >
              <Twitter size={20} className="text-white" />
            </a>
          </div>
        </header>

        {/* Connection Section */}
        <div className="grid grid-md-2 mb-8">
          <SectionCard title="Connect Wallet">
            <WalletComponent onConnect={setAddress} />
          </SectionCard>
          
          <SectionCard title="ASA Configuration">
            <AsaInput asaId={asaId} setAsaId={setAsaId} />
            <div className="mt-4">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isClawback}
                  onChange={() => setIsClawback((prev) => !prev)}
                  className="checkbox-input"
                />
                <Lock size={20} className="text-white-70" />
                Enable Clawback Mode
              </label>
            </div>
          </SectionCard>
        </div>

        {/* Status Display */}
        {address && (
          <div className="status-display">
            <h3 className="status-title">
              <div className="status-dot"></div>
              Connection Status
            </h3>
            <div className="status-grid">
              <div>
                <span className="status-label">Address:</span>
                <p className="status-value">{address.slice(0, 8)}...{address.slice(-8)}</p>
              </div>
              {parsedAsaId && (
                <div>
                  <span className="status-label">ASA ID:</span>
                  <p className="status-value">{parsedAsaId}</p>
                </div>
              )}
              {isManager && (
                <div>
                  <span className="status-label">Role:</span>
                  <p className="status-value green">Manager</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Dashboard Components */}
        {showDashboard && (
          <div className="space-y-6 mb-8">
            <div className="grid grid-md-2">
              <SectionCard title="Balance & Status">
                <div className="space-y-4">
                  <BalanceDisplay address={address} asaId={parsedAsaId} />
                  <OptInStatus address={address} asaId={parsedAsaId} />
                </div>
              </SectionCard>
              
              <SectionCard title="Account Management">
                <OptInButton sender={address} asaId={parsedAsaId} />
              </SectionCard>
            </div>

            <SectionCard title="Token Transfer">
              <AsaTransfer sender={address} asaId={parsedAsaId} />
            </SectionCard>

            <SectionCard title="Transaction History">
              <TransactionHistory address={address} asaId={parsedAsaId} />
            </SectionCard>

            {isManager && (
              <SectionCard title="Manager Operations" className="warning-section">
                <div className="warning-box">
                  <p className="warning-text">
                    ⚠️ Manager-only operations. Use with extreme caution.
                  </p>
                </div>
                <DestroyAsa asaId={parsedAsaId} managerAddress={address} />
              </SectionCard>
            )}
          </div>
        )}

        {/* Clawback Operations */}
        {isClawback && (
          <SectionCard title="Clawback Operations" className="caution-section">
            <div className="caution-box">
              <p className="caution-text">
                ⚠️ Clawback operations require special permissions.
              </p>
            </div>
            <ClawbackTransfer asaId={parsedAsaId} clawbackAddress={address} />
          </SectionCard>
        )}

        {/* ASA Information */}
        {!isNaN(parsedAsaId) && (
          <SectionCard title="ASA Information">
            <AsaInfo asaId={parsedAsaId} />
          </SectionCard>
        )}

        {/* Features Grid - Only show when not connected */}
        {!showDashboard && (
          <div className="grid grid-md-3 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer
          className="footer mt-8 py-4 px-2 rounded-lg shadow-lg"
          style={{
            color: '#0092CA',
            fontWeight: 600,
            fontSize: '1.1rem',
            letterSpacing: '0.02em',
            textAlign: 'center',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
          }}
        >
          <span role="img" aria-label="heart"></span> Built with <span className="animate-pulse">love ❤️</span> for the <span style={{ color: '#0092CA', fontWeight: 700 }}>Algorand</span> ecosystem
        </footer>
      </div>
    </div>
  );
}

export default App;