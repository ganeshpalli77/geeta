const TeacherMessage = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary to-orange-600">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 text-card">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-orange-200 overflow-hidden shadow-elevated">
              <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center">
                <span className="text-6xl">👨‍🏫</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-lg md:text-xl leading-relaxed mb-4">
              विद्यार्थियों के लिए एक ऐसा मंच जहाँ वो अपने विचार और ज्ञान को बाँट सकें और एक दूसरे से सीख सकें। 
              यह ओलंपियाड न केवल प्रतियोगिता है, बल्कि एक सीखने का अनुभव है जो हमारे जीवन को समृद्ध बनाता है।
            </p>
            <p className="text-sm opacity-90">
              - आप अपनी इच्छा आजमा सकते हैं
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherMessage;
