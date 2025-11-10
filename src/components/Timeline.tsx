import parse from 'html-react-parser';
import registrationImage from 'figma:asset/4bcaefc4e9f69e78ddf7b89054609454ba6c3e99.png';
import trophyImage from 'figma:asset/8b4f97933a4356ab6ebc253799594480430c7b21.png';
import swamijiImage from 'figma:asset/e01cfce0b00579d44b5757f2a6dddc81d94d137a.png';

export function Timeline() {
  const milestones = [
    {
      title: 'Registration Opens',
      date: '15 Nov, 2025 to <br/> 31 Dec, 2025',
      icon: registrationImage
    },
    {
      title: 'Grand Finale <br/> (Live Quiz)',
      date: '31 Dec, 2025',
      icon: trophyImage
    },
    {
      title: 'Prize Distribution',
      date: "on PP Swamiji Ji's <br/> Janmotsava",
      icon: swamijiImage
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <button className="text-white px-8 sm:px-16 rounded-[25px] text-xl sm:text-sm md:text-2xl text-center"
          style={{ 
                backgroundColor: '#981a1d',
                color: '#FFFFFF',
                fontWeight: 500,
                padding: '0px 60px',
              }}
          >
            Timeline
          </button>
        </div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 sm:gap-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative z-10">
              <div className="mb-3 md:mb-4">
                <img
                  src={milestone.icon}
                  alt={milestone.title}
                  className="w-20 h-20"
                />
              </div>
              <h3 className="text-base md:text-lg text-center"
              style={{ 
                color: '#981a1d',
                fontWeight: '600',
                fontSize: '25px',

              }}
              >{parse(milestone.title)}</h3>
              <p className="text-md md:text-md text-black text-center" 
              style={{ 
                fontWeight: '500',
                fontSize: '20px',
              }}
              >{parse(milestone.date)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
