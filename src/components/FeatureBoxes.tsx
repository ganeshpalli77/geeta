export function FeatureBoxes() {
  const features = [
    {
      title: "Did You Know?",
      buttonText: "View",
    },
    {
      title: "Shloka of the Day",
      buttonText: "Read",
    },
    {
      title: "Daily Image Reveal",
      buttonText: "Explore",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">
      <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full sm:flex-1 sm:max-w-[400px] h-[120px] sm:h-[150px] bg-[#ffe1a6] flex flex-col items-center justify-center gap-3 md:gap-4"
          >
            <h3 className="text-[#193C77] text-lg md:text-xl">
              {feature.title}
            </h3>
            <button className="bg-[#D55328] hover:bg-[#C44820] text-white px-5 md:px-6 py-2 rounded-[25px] transition-colors text-sm md:text-base">
              {feature.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
