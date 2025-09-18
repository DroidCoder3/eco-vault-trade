import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import WalletConnection from "@/components/WalletConnection";
import CarbonMetrics from "@/components/CarbonMetrics";
import TradingDashboard from "@/components/TradingDashboard";
import PrivateBuyFlow from "@/components/PrivateBuyFlow";

const Trading = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnectWallet = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
  };

  return (
    <main className="min-h-screen bg-background">
      <Header 
        walletConnected={walletConnected}
        onConnectWallet={() => {
          if (!walletConnected) {
            // Simulate wallet connection for header
            handleConnectWallet("0x" + Math.random().toString(16).substr(2, 40));
          }
        }}
      />
      
      <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Carbon Credit Trading</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Execute private, secure carbon credit transactions with advanced privacy protection
          </p>
        </div>

        {/* Wallet Connection */}
        <WalletConnection
          isConnected={walletConnected}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
        />

        {/* Trading Tabs */}
        <Tabs defaultValue="private-buy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="private-buy">Private Buy</TabsTrigger>
            <TabsTrigger value="dashboard">Trading Dashboard</TabsTrigger>
            <TabsTrigger value="metrics">Market Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="private-buy" className="space-y-8">
            <PrivateBuyFlow walletConnected={walletConnected} />
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-8">
            <TradingDashboard walletConnected={walletConnected} />
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-8">
            <CarbonMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Trading;