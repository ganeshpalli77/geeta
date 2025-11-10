export function EngageBanner() {
  return (
    <section className="w-full -mt-[60px] sm:-mt-[75px] pt-[100px] md:py-[100px]"
      style={{ 
          backgroundColor: '#8c2911',
          color: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        }}>
      <div className="text-center space-y-4 md:space-y-6">
        <h2 className="text-3xl text-white px-4 mt-[60px]">
          Engage in different activities and <br className="hidden sm:block" />
          Grow your Geeta Credits daily!
        </h2>
        <button className="text-white px-6 sm:px-8 py-2.5 md:py-3 rounded-[25px] transition-colors text-sm md:text-base font-bold mb-8"
          style={{ 
              backgroundColor: '#c6570a',
              color: '#FFFFFF',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C3B1B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B54520'}
          >
          Learn More
        </button>
      </div>
    </section>
  );
}
