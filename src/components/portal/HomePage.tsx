import Header from '../landing-page/components1/Header';
import Hero from '../landing-page/components1/Hero';
import CategoryCards from '../landing-page/components1/CategoryCards';
import CountdownTimer from '../landing-page/components1/CountdownTimer';
import ParticipantCategories from '../landing-page/components1/ParticipantCategories';
import ExploreEngage from '../landing-page/components1/ExploreEngage';
import Timeline from '../landing-page/components1/Timeline';
import EventsRounds from '../landing-page/components1/EventsRounds';
import GrandPrizes from '../landing-page/components1/GrandPrizes';
import TeacherMessage from '../landing-page/components1/TeacherMessage';
import FinalCTA from '../landing-page/components1/FinalCTA';
import Footer from '../landing-page/components1/Footer';

interface HomePageProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export function HomePage({ onOpenAuth }: HomePageProps) {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <Header onOpenAuth={onOpenAuth} />
      
      {/* Hero Section */}
      <Hero onOpenAuth={onOpenAuth} />
      
      {/* Category Cards - Learn, Quiz, Win */}
      <CategoryCards />
      
      {/* Countdown Timer with Trophy and Mobile */}
      <CountdownTimer />
      
      {/* Participant Categories */}
      <ParticipantCategories />
      
      {/* Explore & Engage */}
      <ExploreEngage />
      
      {/* Timeline */}
      <Timeline />
      
      {/* Events & Rounds */}
      <EventsRounds />
      
      {/* Grand Prizes */}
      <GrandPrizes />
      
      {/* Teacher Message */}
      <TeacherMessage />
      
      {/* Final CTA */}
      <FinalCTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
