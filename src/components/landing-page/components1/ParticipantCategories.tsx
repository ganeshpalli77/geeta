import { Button } from "@/components/ui/button";

const ParticipantCategories = () => {
  const categories = [
    {
      icon: "👶",
      title: "Kids Olympiad",
      ageRange: "AGE: 8-13 years",
      description: "अगर आपका बच्चा 8-13 वर्ष के बिच है",
      bgColor: "bg-orange-100",
      buttonColor: "bg-primary"
    },
    {
      icon: "👨‍🎓",
      title: "Youth Olympiad",
      ageRange: "AGE: 14-25 years",
      description: "अगर आपका बच्चा 14-25 वर्ष के बिच है",
      bgColor: "bg-blue-100",
      buttonColor: "bg-blue-accent"
    },
    {
      icon: "👴",
      title: "Senior Olympiad",
      ageRange: "AGE: 26+ years",
      description: "अगर आपका बच्चा 26+ वर्ष के बिच है",
      bgColor: "bg-red-100",
      buttonColor: "bg-red-500"
    }
  ];

  return (
    <section className="py-16 bg-warm-bg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Participant Categories</h2>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Participate now
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} rounded-2xl p-8 text-center shadow-elevated`}
            >
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">{category.title}</h3>
              <Button 
                className={`${category.buttonColor} hover:opacity-90 text-white w-full mb-4`}
              >
                This for you
              </Button>
              <p className="text-sm text-foreground/70 mb-1">{category.ageRange}</p>
              <p className="text-sm text-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParticipantCategories;
