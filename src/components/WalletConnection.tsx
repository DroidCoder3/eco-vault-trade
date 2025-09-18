import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { useAccount } from 'wagmi';

const WalletConnection = () => {
  const { isConnected, address } = useAccount();

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border shadow-nature">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-earth">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Wallet Status</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected & Ready to Trade" : "Connect your wallet to start trading"}
            </p>
            {isConnected && address && (
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Not Connected</span>
            </div>
          )}
          <ConnectButton />
        </div>
      </div>
    </Card>
  );
};

export default WalletConnection;