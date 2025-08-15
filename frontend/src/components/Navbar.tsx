import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletState, shortenAddress } from '../utils/wallet';

interface NavbarProps {
  walletState: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ walletState, onConnectWallet, onDisconnectWallet }) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🔗 CoreChain SBT
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/mint" 
              className={`nav-link ${isActivePath('/mint') ? 'active' : ''}`}
            >
              Mint SBT
            </Link>
          </li>
          <li>
            <Link 
              to="/all-sbts" 
              className={`nav-link ${isActivePath('/all-sbts') ? 'active' : ''}`}
            >
              All SBTs
            </Link>
          </li>
        </ul>

        <div className="wallet-section">
          {walletState.isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="wallet-address">
                {shortenAddress(walletState.account!)}
              </span>
              <button 
                className="btn btn-secondary" 
                onClick={onDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={onConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;