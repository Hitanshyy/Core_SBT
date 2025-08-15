import React, { useState } from 'react';
import { WalletState } from '../utils/wallet';
import { mintSBT, MintSBTRequest, validateVideoFile } from '../utils/api';

interface MintSBTProps {
  walletState: WalletState;
  onConnectWallet: () => void;
}

const MintSBT: React.FC<MintSBTProps> = ({ walletState, onConnectWallet }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ tokenId: string; transactionHash: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
    setFileError(null);
    setError(null);
    setSuccess(null);

    if (file) {
      const validation = validateVideoFile(file);
      if (!validation.isValid) {
        setFileError(validation.error!);
        setFormData({ ...formData, file: null });
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletState.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!formData.file || !formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in all fields and select a video file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const mintRequest: MintSBTRequest = {
        file: formData.file,
        name: formData.name.trim(),
        description: formData.description.trim(),
        ownerAddress: walletState.account!,
      };

      const result = await mintSBT(mintRequest);
      setSuccess(result);
      
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        file: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint SBT');
    } finally {
      setIsLoading(false);
    }
  };

  // If wallet is not connected, show connect prompt
  if (!walletState.isConnected) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Mint Your SBT</h1>
          <p className="page-description">
            Connect your wallet to start minting Soulbound Tokens on Core Blockchain
          </p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            Wallet Connection Required
          </h3>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            To mint Soulbound Tokens, you need to connect your MetaMask wallet to the Core Blockchain Testnet.
          </p>
          <button className="btn btn-primary" onClick={onConnectWallet}>
            Connect MetaMask Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Mint Your SBT</h1>
        <p className="page-description">
          Create a unique Soulbound Token with your video content. Once minted, 
          it will be permanently tied to your wallet.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <strong>SBT Minted Successfully! 🎉</strong><br />
          Token ID: {success.tokenId}<br />
          Transaction Hash: {success.transactionHash}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card form">
        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="form-group">
            <label htmlFor="video-file" className="form-label">
              Video File (MP4, AVI, MOV, etc.) *
            </label>
            <input
              type="file"
              id="video-file"
              accept="video/*"
              onChange={handleFileChange}
              className="form-file"
              disabled={isLoading}
            />
            <div className="file-info">
              Maximum file size: 20MB | Supported formats: MP4, AVI, MOV, WMV, FLV, WebM
            </div>
            {fileError && (
              <div style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {fileError}
              </div>
            )}
            {formData.file && !fileError && (
              <div style={{ color: 'var(--success-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                ✓ {formData.file.name} ({Math.round(formData.file.size / 1024 / 1024 * 100) / 100} MB)
              </div>
            )}
          </div>

          {/* NFT Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              NFT Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter a unique name for your SBT"
              className="form-input"
              maxLength={100}
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your SBT, its significance, or the story behind it..."
              className="form-textarea"
              maxLength={1000}
              disabled={isLoading}
              required
            />
            <div className="file-info">
              {formData.description.length}/1000 characters
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !formData.file || !formData.name.trim() || !formData.description.trim() || !!fileError}
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Minting SBT...
                </>
              ) : (
                'Mint SBT'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="alert alert-info">
            <strong>Important:</strong> Once minted, this Soulbound Token will be permanently tied to your wallet ({walletState.account?.slice(0, 6)}...{walletState.account?.slice(-4)}) and cannot be transferred to another address.
          </div>
        </form>
      </div>
    </div>
  );
};

export default MintSBT;