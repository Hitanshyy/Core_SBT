// Wallet connection utilities for MetaMask
export interface WalletState {
  account: string | null;
  isConnected: boolean;
  chainId: string | null;
}

// Core Blockchain Testnet configuration
const CORE_TESTNET_CONFIG = {
  chainId: '0x45a', // 1114 in decimal
  chainName: 'Core Blockchain Testnet',
  nativeCurrency: {
    name: 'tCORE',
    symbol: 'tCORE',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.test2.btcs.network'],
  blockExplorerUrls: ['https://scan.test.btcs.network'],
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<WalletState> => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Get current chain ID
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    // Check if we're on Core Testnet, if not, try to switch
    if (chainId !== CORE_TESTNET_CONFIG.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CORE_TESTNET_CONFIG.chainId }],
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (switchError: any) {
        // If the chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CORE_TESTNET_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }

    return {
      account: accounts[0],
      isConnected: true,
      chainId: CORE_TESTNET_CONFIG.chainId,
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const disconnectWallet = (): WalletState => {
  return {
    account: null,
    isConnected: false,
    chainId: null,
  };
};

export const checkWalletConnection = async (): Promise<WalletState> => {
  try {
    if (!window.ethereum) {
      return disconnectWallet();
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts.length === 0) {
      return disconnectWallet();
    }

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    return {
      account: accounts[0],
      isConnected: true,
      chainId,
    };
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return disconnectWallet();
  }
};
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};


// Listen for account and chain changes
export const setupWalletListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void
) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', onChainChanged);
    
    // Return cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', onAccountsChanged);
        window.ethereum.removeListener('chainChanged', onChainChanged);
      }
    };
  }
  return () => {};
};