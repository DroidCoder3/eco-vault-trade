// Environment configuration for Eco Vault Trade
export const config = {
  // Blockchain Configuration
  chainId: 11155111, // Sepolia testnet
  rpcUrl: 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990',
  
  // Wallet Connect Configuration
  walletConnectProjectId: '2ec9743d0d0cd7fb94dee1a7e6d33475',
  
  // Infura Configuration
  infuraApiKey: 'b18fb7e6ca7045ac83c41157ab93f990',
  alternativeRpcUrl: 'https://1rpc.io/sepolia',
  
  // Contract Addresses (to be deployed)
  ecoVaultContract: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
  carbonCreditContract: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
  verificationContract: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
};
