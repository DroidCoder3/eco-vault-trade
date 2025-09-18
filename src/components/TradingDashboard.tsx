import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, ArrowUpDown, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingDashboardProps {
  walletConnected: boolean;
}

const TradingDashboard = ({ walletConnected }: TradingDashboardProps) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('45.50');
  const { toast } = useToast();

  const orders = [
    { id: 1, type: 'buy', amount: 1000, price: 44.20, status: 'active', encrypted: true },
    { id: 2, type: 'sell', amount: 750, price: 46.80, status: 'filled', encrypted: true },
    { id: 3, type: 'buy', amount: 500, price: 43.90, status: 'pending', encrypted: true },
  ];

  const handleTrade = () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trade amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Submitted",
      description: `${tradeType === 'buy' ? 'Buy' : 'Sell'} order for ${amount} tCO₂ submitted privately`,
    });

    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Private Trading Dashboard</h2>
        <p className="text-muted-foreground">Execute trades with full privacy and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-border shadow-earth">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">Private Trade</h3>
              <Badge variant="outline" className="ml-auto bg-gradient-earth text-primary-foreground border-primary">
                Encrypted
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Trade Type Toggle */}
              <div className="flex rounded-lg bg-muted p-1">
                <button
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    tradeType === 'buy' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setTradeType('buy')}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Buy Credits
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    tradeType === 'sell' 
                      ? 'bg-destructive text-destructive-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setTradeType('sell')}
                >
                  <Minus className="w-4 h-4 inline mr-2" />
                  Sell Credits
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (tCO₂)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              {/* Price Display */}
              <div className="space-y-2">
                <Label>Market Price</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-2xl font-bold text-foreground">${price}</span>
                  <span className="text-sm text-muted-foreground">per tCO₂</span>
                  <ArrowUpDown className="w-4 h-4 text-nature ml-auto" />
                </div>
              </div>

              {/* Total */}
              {amount && (
                <div className="p-3 bg-gradient-forest rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Total:</span>
                    <span className="font-semibold text-foreground">
                      ${(parseFloat(amount) * parseFloat(price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Trade Button */}
              <Button
                onClick={handleTrade}
                disabled={!walletConnected || !amount}
                className={`w-full ${
                  tradeType === 'buy' 
                    ? 'bg-gradient-earth hover:opacity-90 text-primary-foreground' 
                    : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                {tradeType === 'buy' ? 'Buy Credits' : 'Sell Credits'} Privately
              </Button>
            </div>
          </Card>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-border shadow-nature">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">Recent Orders</h3>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={order.type === 'buy' ? 'default' : 'destructive'}
                      className={order.type === 'buy' ? 'bg-primary' : ''}
                    >
                      {order.type.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">
                        {order.amount.toLocaleString()} tCO₂
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${order.price.toFixed(2)} per tCO₂
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {order.encrypted && (
                      <Lock className="w-4 h-4 text-primary" />
                    )}
                    <Badge 
                      variant={order.status === 'filled' ? 'default' : 'outline'}
                      className={order.status === 'filled' ? 'bg-nature text-nature-foreground' : ''}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;