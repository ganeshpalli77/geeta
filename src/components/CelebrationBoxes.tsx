import parse from 'html-react-parser';
import celebrateImage from 'figma:asset/e1311a82a975c11c46165799ccc918e5f8db2f77.png';
import participateImage from 'figma:asset/16145dd8c00c2a0c9ba422ce5e1de27e6b98be41.png';
import connectImage from 'figma:asset/ab0f179662b8df4740827b653b04cc0565952fa8.png';

export function CelebrationBoxes() {
  const boxes = [
    {
      title: 'Celebrate',
      subtitle: 'A celebration of learning<br/> & spiritual growth',
      bgColor: '#c6570a',
      image: celebrateImage
    },
    {
      title: 'Participate',
      subtitle: 'Participate in enriching<br/> quizzes and activities',
      bgColor: '#20428d',
      image: participateImage
    },
    {
      title: 'Connect',
      subtitle: 'Connect with a community<br/> of learners',
      bgColor: '#8c2911',
      image: connectImage
    }
  ];

  return (
    <section className="w-full mt-[2px]">
      <div className="flex flex-col md:flex-row gap-[2px]">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="flex-1 pt-6 md:pt-8 flex flex-col items-center text-center gap-2 md:gap-4"
            style={{ backgroundColor: box.bgColor }}
          >
            {box.image && (
              <img
                src={box.image}
                alt={box.title}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            )}
            <h3 className="text-white text-2xl md:text-3xl uppercase" 
              style={{ fontWeight: '600' }}
            >
              {box.title}
            </h3>
            <p className="text-white/90 text-lg mb-2 font-bold"
            style={{
                fontSize: '20px',
                fontWeight: '500',
              }}
            >{parse(box.subtitle)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
