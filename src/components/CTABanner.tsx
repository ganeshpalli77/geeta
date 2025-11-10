import celebrateImage from 'figma:asset/e1311a82a975c11c46165799ccc918e5f8db2f77.png';

interface CTABannerProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  isAuthenticated?: boolean;
}

export function CTABanner({ onOpenAuth, isAuthenticated }: CTABannerProps) {
  return (
    <section className="w-full bg-[#ffeaa0] px-4 sm:px-8 md:px-12 lg:px-20 pt-6 md:pt-8 pb-0">
      <div className="text-center space-y-4 md:space-y-6 pb-6 md:pb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl px-4 font-bold" 
          style={{
            color: "#8d2810",
            fontWeight: 600,
          }}
        >
          JOIN THE JOURNEY — LEARN, REFLECT, AND GROW WITH GEETA!
        </h2>
        {!isAuthenticated && (
          <button 
            onClick={() => onOpenAuth?.('register')}
            className="bg-[#822A12] hover:bg-[#6A2210] text-white px-8 md:px-10 py-3 md:py-4 rounded-[25px] transition-colors text-base md:text-lg font-bold"
            style={{
              backgroundColor:"#c6570a"
            }}
          >
            Register
          </button>
        )}
      </div>
    </section>
  );
}
