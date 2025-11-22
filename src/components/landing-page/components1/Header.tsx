import { Button } from "@/components/ui/button";
import { Globe, LogIn, UserPlus } from "lucide-react";
import learnGeetaLogo from "../landing-page-images/Learn Geeta.png";

interface HeaderProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const Header = ({ onOpenAuth }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={learnGeetaLogo} 
            alt="Learn Geeta - तस्मात् योगी भवार्जुन" 
            className="h-10 sm:h-11 md:h-12 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
          />
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Globe/Language Icon */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Change language"
            title="Change language"
          >
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-gray-800" />
          </button>
          
          {/* Login Button - Outlined */}
          <Button 
            onClick={() => onOpenAuth?.('login')}
            className="flex w-[130px] h-auto px-[35px] py-[10px] items-center justify-center rounded-xl border border-[#F64D02] bg-white text-[#F64D02] hover:bg-orange-50 hover:text-[#E64A19] hover:border-[#E64A19] font-medium transition-all duration-200"
            style={{
              width: '130px',
              padding: '10px 35px',
              borderRadius: '12px',
              border: '1px solid #F64D02',
              background: '#FFF'
            }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span>Login</span>
          </Button>
          
          {/* Register Button - Solid */}
          <Button 
            onClick={() => onOpenAuth?.('register')}
            className="flex w-[130px] h-auto px-[25px] py-[10px] items-center justify-center rounded-xl bg-[#F64D01] hover:bg-[#E64A19] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              width: '130px',
              padding: '10px 25px',
              borderRadius: '12px',
              background: '#F64D01'
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span>Register</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
