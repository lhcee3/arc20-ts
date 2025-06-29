import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Zap, ArrowRight, Github, Twitter, Send, Eye, History, Settings, Trash2, Lock } from 'lucide-react';
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

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}>
    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/80 leading-relaxed">{description}</p>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6 ${className}`}>
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
      {title}
    </h3>
    {children}
  </div>
);

function App() {
  const [address, setAddress] = useState('');
  const [asaId, setAsaId] = useState('');
  const [isClawback, setIsClawback] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [managerAddress, setManagerAddress] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

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
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience near-instant transaction confirmations",
      gradient: "from-purple-600 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your ASA tokens with comprehensive analytics",
      gradient: "from-green-600 to-teal-500"
    }
  ];

  const showDashboard = address && !isNaN(parsedAsaId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3">
              <Wallet size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ARC 20 TS
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive dashboard for managing Algorand Standard Assets with TypeScript precision
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/20 transition-all duration-300 hover:scale-110">
              <Github size={20} className="text-white" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/20 transition-all duration-300 hover:scale-110">
              <Twitter size={20} className="text-white" />
            </button>
          </div>
        </header>

        {/* Connection Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SectionCard title="Connect Wallet">
            <WalletComponent onConnect={setAddress} />
          </SectionCard>
          
          <SectionCard title="ASA Configuration">
            <AsaInput asaId={asaId} setAsaId={setAsaId} />
            <div className="mt-4">
              <label className="text-white font-semibold flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isClawback}
                  onChange={() => setIsClawback((prev) => !prev)}
                  className="w-5 h-5 rounded bg-white/10 border-2 border-white/30 text-blue-500 focus:ring-blue-500 focus:ring-2"
                />
                <Lock size={20} className="text-white/70" />
                Enable Clawback Mode
              </label>
            </div>
          </SectionCard>
        </div>

        {/* Status Display */}
        {address && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              Connection Status
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/70">Address:</span>
                <p className="text-white font-mono">{address.slice(0, 8)}...{address.slice(-8)}</p>
              </div>
              {parsedAsaId && (
                <div>
                  <span className="text-white/70">ASA ID:</span>
                  <p className="text-white font-mono">{parsedAsaId}</p>
                </div>
              )}
              {isManager && (
                <div>
                  <span className="text-white/70">Role:</span>
                  <p className="text-green-400 font-semibold">Manager</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Dashboard Components */}
        {showDashboard && (
          <div className="space-y-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
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
              <SectionCard title="Manager Operations" className="border-red-500/30 bg-red-500/10">
                <div className="bg-red-500/20 rounded-xl p-4 mb-4">
                  <p className="text-red-200 text-sm">
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
          <SectionCard title="Clawback Operations" className="border-orange-500/30 bg-orange-500/10">
            <div className="bg-orange-500/20 rounded-xl p-4 mb-4">
              <p className="text-orange-200 text-sm">
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
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10 mt-16">
          <p className="text-white/50">
            Built with ❤️ for the Algorand ecosystem
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;