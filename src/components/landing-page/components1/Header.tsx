import { Button } from "@/components/ui/button";
import { Globe, LogIn, UserPlus } from "lucide-react";

interface HeaderProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const Header = ({ onOpenAuth }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/Learn Geeta.png" 
            alt="Learn Geeta" 
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Globe/Language Icon */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Change language"
          >
            <Globe className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Login Button - Outlined */}
          <Button 
            variant="outline" 
            size="default"
            onClick={() => onOpenAuth?.('login')}
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-600 font-medium px-6"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
          
          {/* Register Button - Solid */}
          <Button 
            size="default"
            onClick={() => onOpenAuth?.('register')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
