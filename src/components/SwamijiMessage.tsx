import { ImageWithFallback } from './figma/ImageWithFallback';
import swamijiImage from 'figma:asset/b1be310313346b4cc41a1c19e0c46ac2b1e530ee.png';
import gurujiBackground from 'figma:asset/435ea7088cc57855bdf284db416a1ddbf3b33b33.png';
import gurujiMessageBackground from 'figma:asset/b77932ec01d08386272811a89b496dcce465cf5e.png';
import treeBranch from 'figma:asset/4b035e5a54e0630a8e20bbfcdcc5ad1fef238061.png';

export function SwamijiMessage() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-0 relative">
      {/* Decorative tree branch elements - hidden on mobile */}
      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 scale-x-[-1]">
        <img
          src={treeBranch}
          alt=""
          className="w-32 h-auto opacity-40"
        />
      </div>
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
        <img
          src={treeBranch}
          alt=""
          className="w-32 h-auto opacity-40"
        />
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 max-w-7xl mx-auto">
        {/* Left - Swamiji Photo */}
        <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 relative mx-auto lg:mx-0 animate-fade-in-left">
          {/* Background Circle */}
          <img
            src={gurujiBackground}
            alt=""
            className="absolute -top-8 md:-top-12 left-4 md:left-8 w-[85%] h-[85%] object-contain z-0"
          />
          {/* Swamiji Photo */}
          <img
            src={swamijiImage}
            alt="Swamiji"
            className="w-full rounded-2xl shadow-lg relative z-10"
          />
        </div>
        
        {/* Right - Message */}
        <div 
          className="w-full lg:w-2/3 space-y-3 md:space-y-4 p-6 md:p-8 animate-fade-in-right rounded-2xl"
          style={{ 
            backgroundColor: '#B54520'
          }}
        >
          <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-bold" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            भारतीय संस्कृति का समग्र ज्ञान भगवद्गीता में समाहित है। वेदों का विस्तार है उपनिषद और भगवद्गीता उपनिषदों का सार है। योगेश्वर श्रीकृष्ण द्वारा की गई योगशास्त्र की शोभायमान और सुंदर अभिव्यक्ति है भगवद्गीता।
          </p>
          <p className="text-xs sm:text-sm text-white italic font-bold">
            — परम पूज्य स्वामी गोविंददेवगिरि महाराज
          </p>
        </div>
      </div>
    </section>
  );
}
