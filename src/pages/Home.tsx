import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lock, Leaf, TrendingUp, Globe, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import heroForest from "@/assets/hero-forest.jpg";
import earthNetwork from "@/assets/earth-network.jpg";

const Home = () => {
  const features = [
    {
      icon: Lock,
      title: "Private Trading",
      description: "End-to-end encrypted transactions protect your trading data from manipulation and surveillance."
    },
    {
      icon: ShieldCheck,
      title: "Anti-Greenwashing",
      description: "Verified carbon credits with transparent origin tracking prevent fraudulent environmental claims."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with carbon credit traders worldwide through our secure decentralized platform."
    }
  ];

  const stats = [
    { value: "2.8M+", label: "Carbon Credits Traded", unit: "tCO₂" },
    { value: "1,200+", label: "Active Traders", unit: "users" },
    { value: "99.9%", label: "Privacy Score", unit: "secure" },
    { value: "24/7", label: "Market Access", unit: "always" }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroForest})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
        </div>
        
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/trading">
                <Button 
                  size="lg"
                  className="bg-gradient-earth hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-earth transition-all duration-300 hover:shadow-nature hover:scale-105"
                >
                  Start Trading Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-border bg-card/80 backdrop-blur-sm hover:bg-card"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Why Choose EcoTrade?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary privacy-first carbon trading platform built for the future of environmental markets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-nature hover:shadow-earth transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-sky">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Platform Statistics</h2>
            <p className="text-xl text-muted-foreground">
              Real-time metrics from our growing carbon trading ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-card/90 backdrop-blur-sm border-border shadow-nature">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.unit}</div>
                  <div className="text-card-foreground font-medium">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Network Visualization */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="relative overflow-hidden bg-gradient-sky shadow-earth">
            <div 
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${earthNetwork})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-card-foreground">Global Carbon Network</h3>
                  <p className="text-muted-foreground text-lg max-w-lg">
                    Join thousands of traders worldwide in the most secure carbon credit marketplace
                  </p>
                  <Link to="/trading">
                    <Button className="bg-gradient-earth hover:opacity-90 text-primary-foreground mt-4">
                      Explore Trading
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-forest">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-foreground">Ready to Start Trading?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the privacy-first carbon credit revolution and help build a sustainable future
            </p>
            <Link to="/trading">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl font-semibold shadow-earth transition-all duration-300 hover:shadow-nature hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;