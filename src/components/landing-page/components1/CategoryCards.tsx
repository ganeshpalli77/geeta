import { Button } from "@/components/ui/button";

const CategoryCards = () => {
  const categories = [
    {
      icon: "📚",
      title: "Learn the Geeta",
      description: "Through video lessons",
      bgColor: "bg-blue-accent",
      textColor: "text-white"
    },
    {
      icon: "🎯",
      title: "Answer Quizzes",
      description: "Test your knowledge",
      bgColor: "bg-purple-accent",
      textColor: "text-white"
    },
    {
      icon: "🎁",
      title: "Win Prizes",
      description: "Grand rewards await",
      bgColor: "bg-primary",
      textColor: "text-primary-foreground"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} ${category.textColor} rounded-2xl p-8 text-center shadow-elevated`}
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="mb-6 opacity-90">{category.description}</p>
              <Button 
                variant="secondary" 
                className="w-full bg-card text-foreground hover:bg-card/90"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
