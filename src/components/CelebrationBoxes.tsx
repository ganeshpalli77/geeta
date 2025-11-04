import celebrateImage from 'figma:asset/e1311a82a975c11c46165799ccc918e5f8db2f77.png';
import participateImage from 'figma:asset/16145dd8c00c2a0c9ba422ce5e1de27e6b98be41.png';
import connectImage from 'figma:asset/ab0f179662b8df4740827b653b04cc0565952fa8.png';

export function CelebrationBoxes() {
  const boxes = [
    {
      title: 'Celebrate',
      subtitle: 'A celebration of learning & spiritual growth',
      bgColor: '#D55328',
      image: celebrateImage
    },
    {
      title: 'Participate',
      subtitle: 'Join enriching quizzes and activities',
      bgColor: '#193C77',
      image: participateImage
    },
    {
      title: 'Connect',
      subtitle: 'Connect with a community of learners',
      bgColor: '#822A12',
      image: connectImage
    }
  ];

  return (
    <section className="w-full mt-[2px]">
      <div className="flex flex-col md:flex-row gap-[2px]">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="flex-1 p-6 md:p-8 flex flex-col items-center text-center gap-3 md:gap-4 min-h-[220px] md:min-h-[280px]"
            style={{ backgroundColor: box.bgColor }}
          >
            {box.image && (
              <img
                src={box.image}
                alt={box.title}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            )}
            <h3 className="text-white text-xl md:text-2xl">{box.title}</h3>
            <p className="text-white/90 text-sm md:text-base">{box.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
