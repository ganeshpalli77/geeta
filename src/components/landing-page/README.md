# Landing Page Components

This folder contains all components related to the landing/starting page of the Geeta Olympiad application.

## Components

### Main Sections (in order of appearance)

1. **HeroBanner.tsx** - Hero section with Krishna & Arjuna image, Olympiad logo, Hindi text, dates, and Register button
2. **SwamijiMessage.tsx** - Swamiji's photo and message section
3. **FeatureBoxes.tsx** - Three feature boxes (Did You Know?, Thoughts of the Day, Daily Image Reveal)
4. **EngageBanner.tsx** - Engagement banner section
5. **CelebrationBoxes.tsx** - Three colored boxes (Celebrate, Participate, Connect)
6. **Timeline.tsx** - Timeline showing Registration Opens, Grand Finale, and Prize Distribution
7. **CTABanner.tsx** - Call-to-action banner with registration prompt
8. **EventsRounds.tsx** - Events & Rounds section showing quiz levels and additional events
9. **ParticipantCategories.tsx** - Three participant categories (Kids, Youth, Senior Olympiad)
10. **TaglineSection.tsx** - Tagline section
11. **GrandFinale.tsx** - Grand Finale and prizes section

## Usage

All these components are imported and used in:
- `src/components/portal/HomePage.tsx`

## Notes

- All components maintain their original logic and styling
- Import paths have been updated to reflect the new folder structure
- Components use relative imports for shared resources (e.g., `../figma/ImageWithFallback`)
