const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Rotated peach background box */}
      <div
        className="absolute bg-[#FFCEB8] origin-center"
        style={{
          width: '1524px',
          height: '947.637px',
          transform: 'rotate(-1.69deg)',
          left: '50%',
          marginLeft: '-762px',
          top: '0',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 px-4" style={{ paddingTop: '60px', paddingBottom: '0' }}>
        <div className="container mx-auto relative z-20">
          {/* Trophy and Title Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            {/* Trophy Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-[#3B82A0] rounded-full flex items-center justify-center shadow-lg">
                <img
                  src="/trophy-icon.png"
                  alt="Trophy"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">🏆</span>';
                  }}
                />
              </div>
            </div>

            {/* Title Text */}
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-medium text-gray-800 mb-1">
                Learn, participate, and rise to
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#E85A2B] italic">
                The Geeta Olympiad Grand Finale
              </h2>
            </div>
          </div>

          {/* Teacher Message Box */}
          <div
            className="bg-[#E85A2B] rounded-2xl relative z-30"
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              paddingLeft: '120px',
              paddingRight: '151px',
              paddingTop: '32px',
              paddingBottom: '32px',
            }}
          >
            {/* Teacher Image - positioned to extend left */}
            <div
              className="absolute flex-shrink-0"
              style={{
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#F5D56E] border-4 border-[#F5D56E]">
                <img
                  src="/teacher-image.png"
                  alt="Param Pujya Swami Govinddevgiri Maharaj"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center"><span class="text-6xl">👨‍🏫</span></div>';
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">

              {/* Quote Text */}
              <div className="flex-1 text-white">
                <p className="text-base md:text-lg leading-relaxed mb-4">
                  भारतीय संस्कृति का समग्र ज्ञान भगवद्गीता में समाहित है। वेदों का विस्तार है उपनिषद और
                  भगवद्गीता उपनिषदो का सार है। योगेश्वर श्रीकृष्ण द्वारा की गई योगशास्त्र की शोभायमान और सुंदर
                  अभिव्यक्ति है भगवद्गीता।
                </p>
                <p className="text-sm opacity-90">
                  परम पूज्य स्वामी गोविंददेवगिरि महाराज
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave section container - 341px total height from bottom of orange box */}
        <div className="relative w-full" style={{ height: '341px' }}>
          {/* Wave SVG positioned at bottom of this container */}
          <svg
            viewBox="0 0 1524 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0 w-full"
            preserveAspectRatio="none"
            style={{ display: 'block', height: '250px' }}
          >
            {/* Back wave - darkest */}
            <path
              d="M0 80 Q 200 40, 400 70 T 800 50 T 1200 80 T 1524 60 L1524 250 L0 250 Z"
              fill="#8B4D3B"
            />
            {/* Middle wave */}
            <path
              d="M0 120 Q 300 80, 600 110 T 1100 90 T 1524 120 L1524 250 L0 250 Z"
              fill="#A65D4A"
            />
            {/* Front wave - lightest */}
            <path
              d="M0 160 Q 350 130, 700 155 T 1300 140 T 1524 165 L1524 250 L0 250 Z"
              fill="#C47A68"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
