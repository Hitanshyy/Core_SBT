import React from 'react';
import { Link } from 'react-router-dom';
import { WalletState } from '../utils/wallet';

interface HomeProps {
  walletState: WalletState;
  onConnectWallet: () => void;
}

const Home: React.FC<HomeProps> = ({ walletState, onConnectWallet }) => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">CoreChain SBT Minting</h1>
        <p className="hero-subtitle">
          Create and mint Soulbound Tokens (SBTs) on the Core Blockchain Testnet. 
          SBTs are non-transferable NFTs that are permanently tied to your wallet, 
          representing achievements, credentials, or unique digital assets.
        </p>
        
        <div className="hero-cta">
          {walletState.isConnected ? (
            <Link to="/mint" className="btn btn-primary">
              Start Minting SBTs
            </Link>
          ) : (
            <button className="btn btn-primary" onClick={onConnectWallet}>
              Connect Wallet to Begin
            </button>
          )}
        </div>
      </div>

      {/* What are SBTs Section */}
      <div className="card" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)' }}>
          What are Soulbound Tokens (SBTs)?
        </h2>
        <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>
            Soulbound Tokens (SBTs) are a revolutionary type of NFT that cannot be transferred once minted. 
            They are permanently "bound" to the wallet that receives them, creating a permanent record of 
            achievements, credentials, or experiences.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Unlike traditional NFTs that can be bought, sold, or transferred, SBTs represent non-transferable 
            digital assets that build your on-chain identity and reputation. They're perfect for:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Digital certificates and credentials</li>
            <li>Achievement badges and awards</li>
            <li>Membership proofs and access tokens</li>
            <li>Educational certificates</li>
            <li>Event attendance records</li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎥</div>
          <h3 className="feature-title">Video-Based SBTs</h3>
          <p className="feature-description">
            Upload video content to create unique, multimedia Soulbound Tokens that tell your story.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Non-Transferable</h3>
          <p className="feature-description">
            Once minted, your SBTs are permanently tied to your wallet, creating an immutable record.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Core Blockchain</h3>
          <p className="feature-description">
            Built on Core Blockchain Testnet for fast, secure, and cost-effective minting.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3 className="feature-title">Decentralized</h3>
          <p className="feature-description">
            Your SBTs are stored on-chain, ensuring permanence and decentralized ownership.
          </p>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="card">
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)' }}>
          Getting Started
        </h2>
        <div className="features" style={{ marginTop: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>1️⃣</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Connect Wallet</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Connect your MetaMask wallet to the Core Blockchain Testnet
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>2️⃣</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Create Your SBT</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Upload a video, add metadata, and mint your unique Soulbound Token
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>3️⃣</div>
            <h3 style={{ marginBottom: '0.5rem' }}>View Collection</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Browse all minted SBTs and build your on-chain reputation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;