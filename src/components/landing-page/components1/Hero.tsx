import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const Hero = ({ onOpenAuth }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero section.jpg')`
        }}
      />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 py-20">
        <div className="max-w-xl">
          {/* Vivekananda Logo Badge */}
          <div className="bg-white rounded-2xl p-6 mb-6 inline-block shadow-lg">
            <img src="/vivekananda.png" alt="Vivekananda" className="w-24 h-24 object-contain" />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
            ज्ञान प्रवेश से ज्ञान आरोहित तक –<br />
            चलो सजाए गीता की न्याय
          </h1>
          
          <p className="text-base md:text-lg mb-8 text-white drop-shadow-md">
            हरेक बालक की यह विशेष समय
          </p>
          
          <div className="flex gap-4">
            <Button 
              size="lg" 
              onClick={() => onOpenAuth?.('register')}
              className="bg-orange-600 text-white hover:bg-orange-700 shadow-lg font-semibold px-8"
            >
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onOpenAuth?.('login')}
              className="border-2 border-white bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
