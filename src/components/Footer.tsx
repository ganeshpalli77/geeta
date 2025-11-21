import { ImageWithFallback } from './figma/ImageWithFallback';
import footerBg from 'figma:asset/3df4021e49f5f030fd2973b9ed6aa711b3ff3951.png';
import logo from 'figma:asset/ed1389060fec7b047c20c2280d90378f169a3725.png';

export function Footer() {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <img
          src={footerBg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 md:gap-6">
          <div className="flex gap-4 md:gap-6">
            &nbsp;
            <br/><br/><br/><br/>
          </div>
        </div>
      </div>
    </footer>
  );
}
