import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const GrandPrizes = () => {
  return (
    <section className="py-16 bg-warm-peach">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          THE GRAND PRIZES
        </h2>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-elevated">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-accent text-white px-4 py-2 rounded-lg font-bold">
                  1st Prize<br />₹1,00,000
                </div>
                <div className="bg-yellow-accent text-white px-4 py-2 rounded-lg font-bold text-center">
                  Grand<br />Prize
                </div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold">
                  3rd Prize<br />₹25,000
                </div>
              </div>
              
              <div className="relative h-48">
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                  <div className="w-20 h-32 bg-yellow-400 rounded-t-lg flex flex-col items-center justify-start pt-3 shadow-lg">
                    <Trophy className="w-8 h-8 text-yellow-700 mb-1" />
                    <span className="text-2xl font-bold">1</span>
                  </div>
                </div>
                <div className="absolute left-8 bottom-0">
                  <div className="w-20 h-24 bg-gray-300 rounded-t-lg flex flex-col items-center justify-start pt-3 shadow-lg">
                    <Trophy className="w-6 h-6 text-gray-600 mb-1" />
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="absolute right-8 bottom-0">
                  <div className="w-20 h-20 bg-orange-400 rounded-t-lg flex flex-col items-center justify-start pt-3 shadow-lg">
                    <Trophy className="w-6 h-6 text-orange-700 mb-1" />
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg font-semibold">
                I want to participate
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4 text-center shadow-card border-2 border-border">
                  <div className="text-sm text-muted-foreground mb-1">Prize for</div>
                  <div className="font-bold text-foreground">Kids</div>
                </div>
                <div className="bg-card rounded-xl p-4 text-center shadow-card border-2 border-blue-accent">
                  <div className="text-sm text-muted-foreground mb-1">Prize for</div>
                  <div className="font-bold text-foreground">Youth Olympiad</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 text-center">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">3 All expense-paid spiritual scholarships!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrandPrizes;
