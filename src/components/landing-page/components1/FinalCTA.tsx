const FinalCTA = () => {
  return (
    <section className="py-16 bg-warm-peach">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-400 to-primary rounded-3xl p-8 md:p-12 shadow-elevated">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl">📚</span>
              </div>
            </div>
            
            <div className="flex-1 text-card text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Learn, participate, and rise to
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-accent">
                The Geeta Olympiad Grand Finale
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
