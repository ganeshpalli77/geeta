import { Button } from "@/components/ui/button";
import heroImage from "../landing-page-images/hero section.jpg";
import vivekanandaLogo from "../landing-page-images/vivekananda.png";

interface HeroProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const Hero = ({ onOpenAuth }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Pure, No Color Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'none',
          opacity: 1,
          mixBlendMode: 'normal'
        }}
      />
      
      <div className="w-full relative z-10 py-20" style={{ paddingLeft: '100px', paddingRight: '20px' }}>
        <div className="max-w-xl">
          {/* Vivekananda Logo Badge */}
          <div className="bg-white rounded-2xl p-6 mb-6 inline-block shadow-lg">
            <img src={vivekanandaLogo} alt="Vivekananda" className="w-24 h-24 object-contain" />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
            ज्ञान प्रवेश से ज्ञान आलोक तक -<br />
            चलो जगाएं गीता की ज्योत
          </h1>
          
          <p className="text-base md:text-lg mb-8 text-white drop-shadow-md">
            15 नवंबर 2025 से 31 दिसंबर 2025
          </p>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => onOpenAuth?.('register')}
              className="flex justify-center items-center font-semibold text-[#F64D01] hover:text-[#E64A19] transition-colors !w-[140px]"
              style={{
                width: '140px !important',
                height: '58px',
                padding: '17px 35px 18px 35px',
                borderRadius: '14px',
                background: '#FFF',
                boxShadow: '0 20px 25px -5px rgba(99, 99, 99, 0.10), 0 8px 10px -6px rgba(250, 250, 250, 0.10)',
                backdropFilter: 'blur(4px)'
              }}
            >
              Register
            </Button>
            <Button 
              onClick={() => onOpenAuth?.('login')}
              className="flex justify-center items-center font-semibold text-white hover:text-gray-200 transition-colors !w-[140px]"
              style={{
                width: '140px !important',
                height: '58px',
                padding: '17px 35px 18px 35px',
                borderRadius: '14px',
                border: '2px solid #FFF',
                background: 'rgba(255, 255, 255, 0.20)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
                backdropFilter: 'blur(19px)'
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
