import heroImage from 'figma:asset/84f19c2ba36d94dd58ba0503ccdfe2faae953498.png';
import olympiadLogo from 'figma:asset/adb4b523dfe1b7e90c142a3a1a1b74dccbc437ed.png';

interface HeroBannerProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  isAuthenticated?: boolean;
}

export function HeroBanner({ onOpenAuth, isAuthenticated }: HeroBannerProps) {
  return (
    <section className="w-full h-[500px] sm:h-[550px] lg:h-[600px] relative flex items-center overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover sm:object-fill"
        />
      </div>
      
      {/* Content Container with padding */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 flex items-center justify-center md:justify-end">
        {/* Right side - Text content */}
        <div className="w-full md:w-[55%] flex flex-col items-center space-y-4 sm:space-y-6 py-8 sm:py-0 pb-12 sm:pb-8">
          <img
            src={olympiadLogo}
            alt="Geeta Jayanti Olympiad"
            className="w-[220px] sm:w-[280px] md:w-[350px] lg:w-[400px]"
          />
          <p className="text-base sm:text-lg md:text-xl lg:text-[22px] text-[#822A12] text-center px-4 font-bold" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            ज्ञान प्रवाह से ज्ञान आत्मबल तक - <br/> चलो जगाए गीता की ज्योति
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-[20px] text-[#193C77] text-center font-bold" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            15 नवंबर 2025 से 31 दिसंबर 2025
          </p>
          {!isAuthenticated && (
            <button 
              onClick={() => onOpenAuth?.('register')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-[25px] transition-colors w-auto font-bold shadow-lg relative z-20 min-w-[120px]"
              style={{ 
                backgroundColor: '#B54520',
                color: '#FFFFFF',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C3B1B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B54520'}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
