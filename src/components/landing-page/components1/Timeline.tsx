import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Gift } from "lucide-react";

const Timeline = () => {
  const events = [
    {
      icon: Calendar,
      title: "Registration Opens",
      date: "1 Nov 2023 to 15 Dec 2023",
      color: "bg-blue-accent",
      iconBg: "bg-blue-accent"
    },
    {
      icon: Trophy,
      title: "Grand Finale/Quiz",
      date: "Coming Soon",
      color: "bg-yellow-accent",
      iconBg: "bg-yellow-accent"
    },
    {
      icon: Gift,
      title: "Prize Distribution",
      date: "Coming Soon",
      color: "bg-purple-accent",
      iconBg: "bg-purple-accent"
    }
  ];

  return (
    <section className="py-16 bg-warm-peach">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          TIMELINE
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-elevated text-center"
              >
                <div className={`w-16 h-16 ${event.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{event.title}</h3>
                <Button 
                  className={`w-full ${event.color} hover:opacity-90 text-white mb-3`}
                >
                  {event.date}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
