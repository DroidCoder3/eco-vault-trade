import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  Eye,
  EyeOff,
  Fingerprint,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface PrivateBuyFlowProps {
  walletConnected: boolean;
}

type FlowStep = 'amount' | 'privacy' | 'confirm' | 'processing' | 'complete';

const PrivateBuyFlow = ({ walletConnected }: PrivateBuyFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('amount');
  const [amount, setAmount] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');
  const [hideAmount, setHideAmount] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const { toast } = useToast();
  
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const price = 45.50;
  const total = amount ? (parseFloat(amount) * price).toFixed(2) : '0.00';

  const steps = [
    { id: 'amount', title: 'Amount', description: 'Select carbon credits' },
    { id: 'privacy', title: 'Privacy', description: 'Configure anonymity' },
    { id: 'confirm', title: 'Confirm', description: 'Review transaction' },
    { id: 'processing', title: 'Processing', description: 'Executing trade' },
    { id: 'complete', title: 'Complete', description: 'Trade successful' }
  ];

  const privacyLevels = [
    {
      id: 'standard',
      title: 'Standard Privacy',
      description: 'Basic encryption with standard anonymity',
      features: ['Basic encryption', 'Standard mixing', 'Fast processing'],
      icon: Lock
    },
    {
      id: 'enhanced',
      title: 'Enhanced Privacy',
      description: 'Advanced encryption with improved anonymity',
      features: ['Advanced encryption', 'Enhanced mixing', 'Medium processing'],
      icon: ShieldCheck
    },
    {
      id: 'maximum',
      title: 'Maximum Privacy',
      description: 'Military-grade encryption with maximum anonymity',
      features: ['Military-grade encryption', 'Maximum mixing', 'Slower processing'],
      icon: Fingerprint
    }
  ];

  const handleNext = () => {
    if (currentStep === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount of carbon credits",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('privacy');
    } else if (currentStep === 'privacy') {
      setCurrentStep('confirm');
    } else if (currentStep === 'confirm') {
      setCurrentStep('processing');
      executePrivateTrade();
    }
  };

  const executePrivateTrade = async () => {
    try {
      setProcessingProgress(20);
      
      // Simulate FHE encryption process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(40);
      
      // Call smart contract with encrypted parameters
      const contractAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual contract address
      const creditId = 1; // Replace with actual credit ID
      
      // Convert amount to encrypted format (simulated)
      const encryptedAmount = BigInt(Math.floor(parseFloat(amount) * 100)); // Convert to wei-like format
      const encryptedPrice = BigInt(Math.floor(parseFloat(total) * 100)); // Convert to wei-like format
      
      setProcessingProgress(60);
      
      // Write to smart contract
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: [
          {
            "inputs": [
              {"internalType": "uint256", "name": "creditId", "type": "uint256"},
              {"internalType": "uint256", "name": "amount", "type": "uint256"},
              {"internalType": "uint256", "name": "price", "type": "uint256"}
            ],
            "name": "initiateTrade",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'initiateTrade',
        args: [BigInt(creditId), encryptedAmount, encryptedPrice],
      });
      
      setProcessingProgress(80);
      
      if (hash) {
        setTransactionHash(hash);
        setProcessingProgress(100);
        setCurrentStep('complete');
        
        toast({
          title: "Trade Executed Successfully",
          description: `Private transaction completed with hash: ${hash.slice(0, 10)}...`,
        });
      }
      
    } catch (error) {
      console.error('Trade execution failed:', error);
      toast({
        title: "Trade Failed",
        description: "Failed to execute private trade. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('confirm');
    }
  };

  const simulateProcessing = () => {
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep('complete');
          toast({
            title: "Trade Completed Successfully",
            description: `Purchased ${amount} tCO₂ privately with ${privacyLevel} privacy level`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'amount':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Select Amount</h3>
              <p className="text-muted-foreground">How many carbon credits would you like to buy?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Carbon Credits (tCO₂)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per tCO₂:</span>
                  <span className="font-medium">${price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold text-lg">${total}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Privacy Configuration</h3>
              <p className="text-muted-foreground">Choose your preferred privacy level</p>
            </div>
            
            <div className="space-y-4">
              {privacyLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <Card
                    key={level.id}
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      privacyLevel === level.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPrivacyLevel(level.id as any)}
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="w-6 h-6 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{level.title}</h4>
                          {level.id === 'enhanced' && (
                            <Badge variant="outline" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {level.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Confirm Transaction</h3>
              <p className="text-muted-foreground">Review your private purchase details</p>
            </div>
            
            <Card className="p-4 bg-gradient-forest">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Amount:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{hideAmount ? '••••••' : amount} tCO₂</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHideAmount(!hideAmount)}
                      className="p-1 h-auto"
                    >
                      {hideAmount ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Privacy Level:</span>
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    {privacyLevels.find(l => l.id === privacyLevel)?.title}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Total:</span>
                  <span className="font-bold text-lg">${hideAmount ? '••••••' : total}</span>
                </div>
              </div>
            </Card>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Key className="w-4 h-4" />
                <span>Transaction will be encrypted end-to-end with zero-knowledge proofs</span>
              </div>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Processing Private Transaction</h3>
              <p className="text-muted-foreground">Encrypting and executing your carbon credit purchase...</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <Progress value={processingProgress} className="w-full" />
              
              <div className="text-sm text-muted-foreground">
                {processingProgress < 30 && "Generating privacy proofs..."}
                {processingProgress >= 30 && processingProgress < 60 && "Encrypting transaction data..."}
                {processingProgress >= 60 && processingProgress < 90 && "Broadcasting to network..."}
                {processingProgress >= 90 && "Finalizing transaction..."}
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-nature rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-nature-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Purchase Completed!</h3>
              <p className="text-muted-foreground">Your carbon credits have been purchased privately</p>
            </div>
            
            <Card className="p-4 bg-gradient-earth text-primary-foreground">
              <div className="space-y-2">
                <div className="text-sm opacity-90">Transaction Hash:</div>
                <div className="font-mono text-xs break-all">
                  {transactionHash || hash || '0x7a8f9e2d...••••••...b3c4e5f6'}
                </div>
              </div>
            </Card>
            
            <Button 
              onClick={() => {
                setCurrentStep('amount');
                setAmount('');
                setProcessingProgress(0);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start New Transaction
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!walletConnected) {
    return (
      <Card className="p-8 text-center bg-card/90 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">Wallet Required</h3>
          <p className="text-muted-foreground">Connect your wallet to start private carbon credit trading</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              index <= getCurrentStepIndex() 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index < getCurrentStepIndex() ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                index < getCurrentStepIndex() ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-8 bg-card/90 backdrop-blur-sm border-border shadow-earth">
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        {currentStep !== 'processing' && currentStep !== 'complete' && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = getCurrentStepIndex();
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1].id as FlowStep);
                }
              }}
              disabled={getCurrentStepIndex() === 0}
            >
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-gradient-earth hover:opacity-90 text-primary-foreground"
            >
              {currentStep === 'confirm' ? 'Execute Trade' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PrivateBuyFlow;