import registrationImage from 'figma:asset/4bcaefc4e9f69e78ddf7b89054609454ba6c3e99.png';
import trophyImage from 'figma:asset/8b4f97933a4356ab6ebc253799594480430c7b21.png';
import swamijiImage from 'figma:asset/e01cfce0b00579d44b5757f2a6dddc81d94d137a.png';

export function Timeline() {
  const milestones = [
    {
      title: 'Registration Opens',
      date: 'Nov 15 – Dec 31, 2025',
      icon: registrationImage
    },
    {
      title: 'Grand Finale',
      date: '(Live Quiz)',
      date2: '31 Dec',
      icon: trophyImage
    },
    {
      title: 'Prize Distribution',
      date: "on PP Swamiji Ji's Janmotsava",
      icon: swamijiImage
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#193C77] text-center mb-8 md:mb-12">Timeline</h2>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 sm:gap-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src={milestone.icon}
                  alt={milestone.title}
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </div>
              <h3 className="text-base md:text-lg text-[#193C77] text-center mb-2">{milestone.title}</h3>
              <p className="text-xs md:text-sm text-[#822A12] text-center">{milestone.date}</p>
              {milestone.date2 && (
                <p className="text-xs md:text-sm text-[#822A12] text-center">{milestone.date2}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
