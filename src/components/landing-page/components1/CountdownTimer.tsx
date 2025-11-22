const CountdownTimer = () => {
  return (
    <section 
      className="w-full py-8 -mt-24 relative z-20" 
      style={{ 
        backgroundColor: '#FFCEB8',
        height: '250px',
        transform: 'rotate(-1.2deg)'
      }}
    >
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="h-full flex items-start justify-center" style={{ marginTop: '-75px', transform: 'rotate(1.2deg)' }}>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Trophy and Grand Prizes */}
            <div className="flex items-center gap-6 flex-shrink-0 -ml-32 mt-8">
            <img 
              src="/trophee.png" 
              alt="Trophy" 
              className="object-contain flex-shrink-0"
              style={{
                width: '275.126px',
                height: '275.126px',
                aspectRatio: '275.13/275.13'
              }}
            />
            <div>
              <h3 
                className="font-bold mb-2"
                style={{
                  color: '#101828',
                  fontSize: '54px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '98%'
                }}
              >
                Grand
              </h3>
              <h3 
                className="font-bold -mt-2"
                style={{
                  color: '#101828',
                  fontSize: '54px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '98%'
                }}
              >
                Prizes
              </h3>
              <p className="text-gray-600 text-sm mt-1">Win Amazing Rewards</p>
            </div>
          </div>
          
          {/* Center - Orange Stats Card */}
          <div className="rounded-3xl px-8 py-6 text-white shadow-lg" style={{ backgroundColor: '#F54900' }}>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">35</div>
                <div className="text-sm opacity-90">Days</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">7</div>
                <div className="text-sm opacity-90">Rounds</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-4xl font-bold">∞</div>
                <div className="text-sm opacity-90">Wisdom</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Tap Play Learn and Mobile */}
            <div className="flex items-center -mr-24">
            <div className="text-right -mr-4">
              <h3 
                style={{
                  color: '#101828',
                  textAlign: 'right',
                  fontSize: '54px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '100%'
                }}
              >
                Tap.
              </h3>
              <h3 
                style={{
                  color: '#101828',
                  textAlign: 'right',
                  fontSize: '54px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '100%'
                }}
              >
                Play.
              </h3>
              <h3 
                style={{
                  color: '#101828',
                  textAlign: 'right',
                  fontSize: '54px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '100%'
                }}
              >
                Learn.
              </h3>
            </div>
            <img 
              src="/Mobile.png" 
              alt="Mobile App" 
              className="object-contain flex-shrink-0"
              style={{
                width: '312.138px',
                height: '312.138px',
                aspectRatio: '312.14/312.14'
              }}
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
