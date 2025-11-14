import podiumImage from 'figma:asset/a2bf327d3524de693214b7d0523907ebc8a46bc9.png';
import wreathImage from 'figma:asset/61f604eee1e4b9e65612d9e884e4f9c27eb449a9.png';

export function GrandFinale() {

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-0">
      <div className="max-w-7xl mx-auto relative pt-6 md:pt-8">
        {/* Title positioned on top */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-[#981a1d] text-white px-6 md:px-10 py-1 md:py-1 rounded-[25px] uppercase text-xl sm:text-sm md:text-2xl text-center font-bold">
            The Grand Prizes
          </div>
        </div>
        
        <div className="p-6 sm:p-8 md:p-12 pt-3 md:pt-4 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Podium - Left Half */}
            <div className="flex flex-col items-center">
              {/* Prize Text Above Podium */}
              <div className="flex justify-center items-start w-full max-w-md mb-1 relative">
                {/* 2nd Prize - Left */}
                <div className="absolute left-[-2%] sm:left-[2%] top-8 sm:top-12 text-center">
                  <div className="text-sm sm:text-base md:text-xl text-[#193C77] font-bold">2nd Prize</div>
                  <div className="text-sm sm:text-base md:text-lg text-[#822A12] font-bold">₹ 51,000</div>
                </div>
                
                {/* 1st Prize - Center */}
                <div className="text-center">
                  <div className="text-base sm:text-xl md:text-2xl text-[#193C77] font-bold">1st Prize</div>
                  <div className="text-base sm:text-lg md:text-xl text-[#822A12] font-bold">₹ 1,00,000</div>
                </div>
                
                {/* 3rd Prize - Right */}
                <div className="absolute right-[-2%] sm:right-[2%] top-12 sm:top-20 text-center">
                  <div className="text-sm sm:text-base md:text-xl text-[#193C77] font-bold">3rd Prize</div>
                  <div className="text-sm sm:text-base md:text-lg text-[#822A12] font-bold">₹ 21,000</div>
                </div>
              </div>
              
              {/* Podium Image */}
              <img
                src={podiumImage}
                alt="Podium with prizes"
                className="w-full max-w-md"
              />
            </div>
            
            {/* Special Recognition - Right Half */}
            <div className="flex flex-col justify-center">
              <h4 className="text-base sm:text-lg md:text-xl text-[#193C77] mb-4 md:mb-6 text-center font-bold">Special Recognition Across Categories</h4>
              <div className="flex justify-center gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                    <img
                      src={wreathImage}
                      alt="Top 100"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm sm:text-base md:text-lg text-[#193C77] font-bold">Top 100</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-[#822A12] font-bold">₹1100</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                    <img
                      src={wreathImage}
                      alt="Top 1000"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm sm:text-base md:text-lg text-[#193C77] font-bold">Top 1000</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-[#822A12] font-bold">Olympiad T-Shirts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
