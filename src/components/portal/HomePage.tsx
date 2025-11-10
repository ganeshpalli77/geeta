import { Header } from '../Header';
import { HeroBanner } from '../HeroBanner';
import { SwamijiMessage } from '../SwamijiMessage';
import { FeatureBoxes } from '../FeatureBoxes';
import { EngageBanner } from '../EngageBanner';
import { CelebrationBoxes } from '../CelebrationBoxes';
import { Timeline } from '../Timeline';
import { EventsRounds } from '../EventsRounds';
import { ParticipantCategories } from '../ParticipantCategories';
import { TaglineSection } from '../TaglineSection';
import { GrandFinale } from '../GrandFinale';
import { CTABanner } from '../CTABanner';
import { Footer } from '../Footer';
import { useApp } from '../../contexts/AppContext';

interface HomePageProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export function HomePage({ onOpenAuth }: HomePageProps) {
  const { isAuthenticated } = useApp();
  
  return (
    <div className="min-h-screen w-[900px] bg-white" 
    style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      {/* <Header onOpenAuth={onOpenAuth} /> */}
      
      {/* Step 2: Hero Banner - Full Width */}
      <HeroBanner onOpenAuth={onOpenAuth} isAuthenticated={isAuthenticated} />
      
      {/* Main content with responsive spacing between sections */}
      <main className="w-full">
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          
          {/* Step 3: Swamiji Message Section - Full Width */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-[60px]">
            <SwamijiMessage />
          </div>
          
          {/* Step 4: Three Feature Boxes */}
          <FeatureBoxes />
          
          {/* Step 5: Engage Banner - Full Width (overlaps with feature boxes) */}
          <EngageBanner />
          
          {/* Step 6: Celebrate-Participate-Connect Boxes */}
          <CelebrationBoxes />
          
          {/* Step 7: Timeline Section - Full Width */}
          <div className="mt-4 sm:mt-8 md:mt-8 lg:mt-8">
            <Timeline />
          </div>
          
          {/* Step 11: Closing CTA Banner - Full Width */}
          <CTABanner onOpenAuth={onOpenAuth} isAuthenticated={isAuthenticated} />
          
          {/* Step 8: Events & Rounds Section */}
          <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-[60px]">
            <EventsRounds />
          </div>
          
          {/* Step 9: Participant Categories */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[60px]">
            <ParticipantCategories />
          </div>
          
          {/* Tagline Section */}
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-[120px]">
            <TaglineSection />
          </div>
          
          {/* Step 10: Grand Finale & Prizes */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[60px]">
            <GrandFinale />
          </div>
        </div>
      </main>
      
      {/* Step 12: Footer - Full Width */}
      <Footer />
    </div>
  );
}
