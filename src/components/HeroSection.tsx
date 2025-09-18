import { Button } from "@/components/ui/button";
import { Shield, Leaf, TrendingUp } from "lucide-react";
import heroForest from "@/assets/hero-forest.jpg";

const HeroSection = ({ onConnectWallet }: { onConnectWallet: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroForest})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Trade Carbon Credits
            <span className="block bg-gradient-earth bg-clip-text text-transparent">
              Privately
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Secure, encrypted carbon token trading that prevents market manipulation 
            and greenwashing through advanced privacy technology.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-nature">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-card-foreground font-medium">Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-nature">
              <Leaf className="w-5 h-5 text-nature" />
              <span className="text-card-foreground font-medium">Eco-Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-nature">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-card-foreground font-medium">Fair Trading</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg"
              onClick={onConnectWallet}
              className="bg-gradient-earth hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-earth transition-all duration-300 hover:shadow-nature hover:scale-105"
            >
              Connect Wallet & Start Trading
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;