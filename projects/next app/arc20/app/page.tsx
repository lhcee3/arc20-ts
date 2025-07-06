"use client";
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Zap, Github, Twitter, Lock, ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient, delay = 0 }) => (
  <div 
    className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-6 transition-all duration-300 hover:shadow-lg border border-gray-700/50`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'fadeInUp 0.6s ease-out forwards'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-500/20 backdrop-blur-sm border border-teal-400/30">
        <Icon size={24} className="text-teal-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
      <div className="w-1 h-5 bg-teal-400 rounded-full" />
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface FloatingOrbProps {
  className: string;
  delay?: number;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({ className, delay = 0 }) => (
  <div 
    className={`absolute rounded-full bg-gradient-to-r from-teal-400/10 to-gray-400/10 blur-2xl animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

const AnimatedBackground: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <FloatingOrb className="w-96 h-96 -top-48 -left-48" delay={0} />
    <FloatingOrb className="w-80 h-80 top-1/4 -right-40" delay={1} />
    <FloatingOrb className="w-72 h-72 bottom-1/4 left-1/4" delay={2} />
    <FloatingOrb className="w-64 h-64 -bottom-32 -right-32" delay={3} />
  </div>
);

const App: React.FC = () => {
  const [address] = useState<string>('');
  const [asaId, setAsaId] = useState<string>('');
  const [isClawback, setIsClawback] = useState<boolean>(false);
  const [isManager] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features: FeatureCardProps[] = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Built on Algorand's secure and fast blockchain infrastructure",
      gradient: "from-gray-800 to-gray-900",
      delay: 100
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience near-instant transaction confirmations",
      gradient: "from-gray-800 to-gray-900",
      delay: 200
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your ASA tokens with comprehensive insights",
      gradient: "from-gray-800 to-gray-900",
      delay: 300
    }
  ];

  const showDashboard = address && !isNaN(parseInt(asaId));

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-12 pb-8 text-center">
          <div 
            className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 mb-6 shadow-lg border border-teal-400/20">
              <Wallet size={32} className="text-teal-400" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-teal-100 to-gray-300 bg-clip-text text-transparent">
              ARC 20 TS
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Your comprehensive dashboard for managing Algorand Standard Assets with TypeScript precision
            </p>
          </div>
        </header>

        {/* Connection Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <SectionCard title="Connect Wallet">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg font-medium text-white hover:from-teal-500 hover:to-teal-600 transition-all duration-200 shadow-sm">
                <Wallet size={18} />
                Connect Wallet
                <ChevronRight size={14} />
              </button>
              
              {address && (
                <div className="p-4 bg-gray-800/30 rounded-lg border border-teal-500/20">
                  <p className="text-xs text-gray-500 mb-1">Connected Address</p>
                  <p className="text-teal-300 font-mono text-sm break-all">
                    {address.slice(0, 8)}...{address.slice(-8)}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
          
          <SectionCard title="ASA Configuration">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ASA ID</label>
                <input
                  type="text"
                  value={asaId}
                  onChange={(e) => setAsaId(e.target.value)}
                  placeholder="Enter ASA ID"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isClawback}
                  onChange={() => setIsClawback(prev => !prev)}
                  className="w-4 h-4 rounded border-2 border-teal-500 bg-transparent checked:bg-teal-500 checked:border-teal-500 focus:ring-teal-500 focus:ring-1 focus:ring-offset-0 transition-all duration-200"
                />
                <Lock size={14} className="text-teal-400" />
                <span className="text-gray-400 text-sm">Enable Clawback Mode</span>
              </label>
            </div>
          </SectionCard>
        </div>

        {/* Status Display */}
        {address && (
          <div className="mb-12 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-200">Connection Status</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-white font-mono text-sm">{address.slice(0, 8)}...{address.slice(-8)}</p>
              </div>
              
              {parseInt(asaId) && (
                <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-1">ASA ID</p>
                  <p className="text-white font-mono text-sm">{parseInt(asaId)}</p>
                </div>
              )}
              
              {isManager && (
                <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-teal-400 font-semibold">Manager</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Grid - Only show when not connected */}
        {!showDashboard && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!showDashboard && (
          <div className="text-center mb-16">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg font-medium text-white hover:from-teal-500 hover:to-teal-600 transition-all duration-200 shadow-sm">
              <span>Get Started</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="py-8 text-center border-t border-gray-800">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <span className="text-gray-400">Built with</span>
              <span className="text-gray-500">❤️</span>
              <span className="text-gray-400">for the</span>
              <span className="text-teal-400 font-semibold">Algorand</span>
              <span className="text-gray-400">ecosystem</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6">
            <button
              className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-teal-400 transition-colors duration-200"
              onClick={() => window.open('https://github.com/lhcee3/arc20-ts', '_blank')}
            >
              <Github size={20} className="group-hover:text-teal-400 transition-colors" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
            
            <button
              className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-teal-400 transition-colors duration-200"
              onClick={() => window.open('https://x.com/lhcee3', '_blank')}
            >
              <Twitter size={20} className="group-hover:text-teal-400 transition-colors" />
              <span className="text-sm font-medium">Twitter</span>
            </button>
          </div>
        </footer>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default App;