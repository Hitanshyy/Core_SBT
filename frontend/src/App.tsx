import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MintSBT from './pages/MintSBT';
import AllSBTs from './pages/AllSBTs';
import { 
  WalletState, 
  connectWallet, 
  disconnectWallet, 
  checkWalletConnection, 
  setupWalletListeners 
} from './utils/wallet';

function App() {
  // Wallet state management
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    chainId: null,
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check wallet connection on app load
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const state = await checkWalletConnection();
        setWalletState(state);
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    initializeWallet();

    // Setup wallet event listeners
    const cleanup = setupWalletListeners(
      (accounts: string[]) => {
        // Handle account change
        if (accounts.length === 0) {
          setWalletState(disconnectWallet());
        } else {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
            isConnected: true,
          }));
        }
      },
      (chainId: string) => {
        // Handle chain change
        setWalletState(prev => ({
          ...prev,
          chainId,
        }));
        
        // You might want to show a notification if user switches to wrong network
        const CORE_TESTNET_CHAIN_ID = '0x45c';
        if (chainId !== CORE_TESTNET_CHAIN_ID) {
          console.warn('Please switch to Core Blockchain Testnet');
        }
      }
    );

    // Cleanup listeners on unmount
    return cleanup;
  }, []);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const state = await connectWallet();
      setWalletState(state);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
      
      // Show error for 5 seconds
      setTimeout(() => {
        setConnectionError(null);
      }, 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = () => {
    setWalletState(disconnectWallet());
    setConnectionError(null);
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <Navbar 
          walletState={walletState}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
        />

        {/* Connection Error Alert */}
        {connectionError && (
          <div style={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            maxWidth: '90%',
            width: '400px'
          }}>
            <div className="alert alert-error">
              <strong>Connection Error:</strong> {connectionError}
            </div>
          </div>
        )}

        {/* Connecting Overlay */}
        {isConnecting && (
          <div style={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            maxWidth: '90%',
            width: '300px'
          }}>
            <div className="alert alert-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="loading-spinner"></div>
                Connecting wallet...
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  walletState={walletState} 
                  onConnectWallet={handleConnectWallet} 
                />
              } 
            />
            <Route 
              path="/mint" 
              element={
                <MintSBT 
                  walletState={walletState} 
                  onConnectWallet={handleConnectWallet} 
                />
              } 
            />
            <Route path="/all-sbts" element={<AllSBTs />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          marginTop: '4rem',
          padding: '2rem 0',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          background: 'var(--card-bg)'
        }}>
          <div className="container">
            <p>
              Built on Core Blockchain Testnet • SBT Minting DApp 
            
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;