import { ImageWithFallback } from './figma/ImageWithFallback';
import firstRoundImage from 'figma:asset/4db57f4a98cef27888772fb1d7e0abd9c321656b.png';
import secondRoundImage from 'figma:asset/05e419c6a2f9ca2c49ca6c49d36e50c98d0b64fa.png';
import thirdRoundImage from 'figma:asset/1baf62afc6e548dfe5a1b468b24bd371202e9f47.png';
import sloganEventImage from 'figma:asset/d361286d97b8cacfde253ac6ef139d46142f1b6c.png';
import shlokaEventImage from 'figma:asset/d217db6412e098f80f4cfd325ad8d9254fb04095.png';
import reelsEventImage from 'figma:asset/fdcbeb1bd6eaf5f0de07c1c8beccea431c8d892e.png';
import artEventImage from 'figma:asset/91f840562edf6c931819d72ca7bfce73080731d9.png';

export function EventsRounds() {
  const rounds = [
    {
      title: 'प्रश्न योद्धा',
      subtitle: 'The foundational quiz level for all participants to test their basic knowledge of the Bhagavad Geeta.',
      accentColor: '#193C77',
      image: firstRoundImage
    },
    {
      title: 'ज्ञान प्रवीण',
      subtitle: 'A challenging step up that explores deeper concepts and teachings from the Geeta.',
      accentColor: '#D55328',
      image: secondRoundImage
    },
    {
      title: 'विद्या धुरंधर',
      subtitle: 'Final, most comprehensive round where participants demonstrate mastery of Geeta wisdom.',
      accentColor: '#193C77',
      image: thirdRoundImage
    }
  ];

  const additionalEvents = [
    {
      title: 'शब्द घोष',
      subtitle: 'Slogan Writing on any shloka/adhyay of Bhagavad Geeta',
      icon: sloganEventImage
    },
    {
      title: 'मधुर श्लोकगान',
      subtitle: 'Upload Shloka chanting video on Instagram/Facebook/Youtube',
      icon: shlokaEventImage
    },
    {
      title: 'दॄश्य सृजन',
      subtitle: 'Create reels on given topics or the offline Geet Jayanti event.',
      icon: reelsEventImage
    },
    {
      title: 'कला एवं अभिव्यक्ती',
      subtitle: 'Express Geeta through art, poetry, music, or performances',
      icon: artEventImage
    }
  ];

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-0 pb-0">
      <div className="max-w-7xl mx-auto relative">
        {/* Title positioned on top border */}
        <div className="flex justify-center absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 z-10">
          <div className="bg-[#822A12] text-white px-6 md:px-10 py-3 md:py-4 rounded-[25px] text-sm md:text-base">
            Events & Rounds
          </div>
        </div>
        
        <div className="border-2 border-[#b3c5d8] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 pt-12 md:pt-16 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
            {rounds.map((round, index) => (
              <div
                key={index}
                className="flex-1 bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: round.accentColor }}
                />
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                  {round.image && (
                    <div className="flex justify-center mb-3 md:mb-4">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center p-2 md:p-3"
                        style={{ backgroundColor: round.accentColor }}
                      >
                        <img
                          src={round.image}
                          alt={round.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg md:text-2xl text-[#193C77] text-center" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    {round.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-700 text-center">
                    {round.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Event Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 justify-items-center gap-6 sm:gap-8 md:gap-12 mt-8 md:mt-12">
            {additionalEvents.map((event, index) => (
              <div key={index} className="flex flex-col items-center max-w-[140px]">
                <div className="mb-2 md:mb-3">
                  {typeof event.icon === 'string' && event.icon.startsWith('http') ? (
                    <ImageWithFallback
                      src={event.icon}
                      alt={event.title}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#265a8f] rounded-full flex items-center justify-center p-2">
                      <img
                        src={event.icon}
                        alt={event.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-[#193C77] text-center" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{event.title}</p>
                <p className="text-[9px] md:text-[10px] text-gray-600 text-center mt-1">{event.subtitle}</p>
              </div>
            ))}
          </div>
          
          {/* Bottom Line */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-[#193C77]">
              Earn Points from all events and head towards Grand Finale
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
