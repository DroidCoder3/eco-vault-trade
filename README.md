# Eco Vault Trade

A decentralized trading platform for carbon credits and environmental assets built with FHE (Fully Homomorphic Encryption) technology.

## Features

- **Secure Trading**: FHE-encrypted transactions for privacy-preserving carbon credit trading
- **Real-time Analytics**: Advanced dashboard for tracking environmental impact
- **Multi-wallet Support**: Connect with Rainbow, MetaMask, and other popular wallets
- **Transparent Reporting**: Blockchain-based verification of carbon credit authenticity

## Technologies

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DroidCoder3/eco-vault-trade.git
cd eco-vault-trade
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Smart Contracts

The platform uses FHE-encrypted smart contracts for secure carbon credit trading:

- **EcoVault.sol**: Main trading contract with FHE encryption
- **CarbonCredit.sol**: Carbon credit token contract
- **Verification.sol**: Credit verification and validation

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@ecovaulttrade.com or join our Discord community.