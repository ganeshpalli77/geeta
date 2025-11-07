export function FeatureBoxes() {
  const features = [
    {
      title: 'Did You Know?',
      buttonText: 'View'
    },
    {
      title: 'Shloka of the Day',
      buttonText: 'Read'
    },
    {
      title: 'Daily Image Reveal',
      buttonText: 'Explore'
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">
      <div className="flex flex-col sm:flex-row justify-center gap-0 max-w-7xl mx-auto divide-y-[2px] sm:divide-y-0 sm:divide-x-[2px] divide-white">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full sm:flex-1 sm:max-w-[400px] h-[120px] sm:h-[150px] bg-[#ffe1a6] flex flex-col items-center justify-center gap-3 md:gap-4"
          >
            <h3 className="text-[#193C77] text-[22px] md:text-[24px] font-bold">{feature.title}</h3>
            <button className="bg-[#B54520] hover:bg-[#9C3B1B] text-white px-5 md:px-6 py-2 rounded-[25px] transition-colors text-sm md:text-base font-bold" style={{ color: '#FFFFFF', backgroundColor: '#B54520' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C3B1B'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B54520'}>
              {feature.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
