import { Button } from "@/components/ui/button";

const EventsRounds = () => {
  const rounds = [
    {
      title: "Unit Quiz",
      color: "bg-blue-500",
      description: "This is a chapter-based quiz. So after your complete study of a unit you can participate.",
      features: [
        "5 रे वह एक परीक्षा प्रत्येक सप्ताह",
        "हर सप्ताह एक विषय के लिए",
        "रोज़ एक नेतृत्व बोर्ड",
        "दैनिक और साप्ताहिक विजेता",
        "प्रत्येक रे वह प्रश्न के लिए 60s"
      ]
    },
    {
      title: "Unit Semi",
      color: "bg-amber-600",
      description: "This is a chapter-based quiz. So after your complete study of a unit you can participate.",
      features: [
        "Prize Entitlement",
        "Bonus Entries"
      ]
    },
    {
      title: "Final Quiz",
      color: "bg-gray-400",
      description: "This is a chapter-based quiz. So after your complete study of a unit you can participate.",
      features: [
        "Prize Entitlement",
        "Bonus Entries"
      ]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full">
            Events & Rounds
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {rounds.map((round, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-warm-peach rounded-3xl p-6 min-h-[400px] relative shadow-elevated">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-white/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className={`text-xl font-bold ${round.color.replace('bg-', 'text-')} mb-2`}>
                    {round.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    {round.description}
                  </p>
                </div>
                
                <div className="bg-card rounded-2xl p-4 space-y-2">
                  {round.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  {index === 0 ? "Unit Quiz will be conducted at" : ""}
                  {index === 1 ? "Unit Semi Finals will be conducted at" : ""}
                  {index === 2 ? "Last day of the Olympiad will be conducted at" : ""}
                </h4>
                <p className="text-sm text-muted-foreground">
                  THE END OF EVERY OLYMPIAD FORTNIGHT
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsRounds;
