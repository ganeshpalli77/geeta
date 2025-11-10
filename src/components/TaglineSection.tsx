import trophyImage from "figma:asset/6c8f53855abde9cefdbf907162db195cb225d671.png";

export function TaglineSection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-15 py-6 md:py-8 lg:py-0 bg-[#a83a1b] relative overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 md:gap-12 py-6 relative">
        {/* Trophy Image with Circular Background */}
        <div className="relative flex-shrink-0">
          <div
            className="w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-[#265a8f] flex items-center justify-center lg:absolute lg:-top-[15%] lg:left-0"
            style={{ transform: "lg:translateY(-22%)" }}
          >
            <img
              src={trophyImage}
              alt="Trophy"
              className="w-32 h-32 sm:w-36 sm:h-36 lg:w-48 lg:h-48 object-contain"
            />
          </div>
          {/* Spacer to maintain layout on desktop */}
          <div className="hidden lg:block w-64 h-30"></div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center px-4">
          <div className="text-white mb-2"
            style={{
              fontWeight: 700,
              fontSize: '40px'
            }}
          >
            Learn, participate, and rise to
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl text-[#ffca58]"
          style={{
              fontWeight: 700,
              fontSize: '45px'
            }}
          >
            The Geeta Olympiad Grand Finale
          </div>
        </div>
      </div>
    </section>
  );
}