import { Button } from "@/components/ui/button";

const ExploreEngage = () => {
  const activities = [
    {
      icon: "🎊",
      title: "Celebrate",
      description: "Celebrate your progress and achievements",
      bgColor: "bg-orange-100"
    },
    {
      icon: "👥",
      title: "Participate",
      description: "Join in regular quizzes and competitions",
      bgColor: "bg-blue-100"
    },
    {
      icon: "🔗",
      title: "Connect",
      description: "Connect with the Geeta community worldwide",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <section className="py-16 bg-warm-bg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Explore & Engage</h2>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Explore more
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`${activity.bgColor} rounded-2xl p-8 text-center shadow-card`}
            >
              <div className="text-4xl mb-4">{activity.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{activity.title}</h3>
              <p className="text-foreground/70">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreEngage;
