import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Leaf, Globe } from "lucide-react";
import earthNetwork from "@/assets/earth-network.jpg";

const CarbonMetrics = () => {
  const metrics = [
    {
      title: "Total Carbon Credits",
      value: "2,847,293",
      unit: "tCO₂",
      change: "+12.5%",
      isPositive: true,
      icon: Leaf,
    },
    {
      title: "Active Traders",
      value: "1,293",
      unit: "users",
      change: "+8.2%",
      isPositive: true,
      icon: Globe,
    },
    {
      title: "24h Trading Volume", 
      value: "847,293",
      unit: "tCO₂",
      change: "-2.1%",
      isPositive: false,
      icon: TrendingUp,
    },
    {
      title: "Privacy Score",
      value: "99.8%",
      unit: "secure",
      change: "+0.1%",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Market Overview</h2>
        <p className="text-muted-foreground">Real-time carbon credit trading metrics</p>
      </div>
      
      {/* Earth visualization */}
      <Card className="relative overflow-hidden bg-gradient-sky">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${earthNetwork})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-semibold text-card-foreground">Global Carbon Network</h3>
            <p className="text-muted-foreground">Private trading connections worldwide</p>
          </div>
        </div>
      </Card>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 bg-card/80 backdrop-blur-sm border-border shadow-nature hover:shadow-earth transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-full bg-gradient-earth">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.isPositive ? 'text-primary' : 'text-destructive'
                }`}>
                  {metric.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-card-foreground">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CarbonMetrics;