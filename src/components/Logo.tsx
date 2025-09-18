import { Trees, Zap } from "lucide-react";
import logoMain from "@/assets/logo-main.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <img 
          src={logoMain} 
          alt="EcoTrade Logo" 
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${textSizeClasses[size]} leading-none`}>
            EcoTrade
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wider">
            PRIVATE CARBON
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;