import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ProfileProvider } from './context';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for code-splitting
const Home = lazy(() => import('./pages/Home'));
const Wheel = lazy(() => import('./pages/Wheel'));
const Graph = lazy(() => import('./pages/Graph'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileAstrology = lazy(() => import('./pages/ProfileAstrology'));
const ProfileGeneKeys = lazy(() => import('./pages/ProfileGeneKeys'));
const ProfileHumanDesign = lazy(() => import('./pages/ProfileHumanDesign'));
const ProfilePlacements = lazy(() => import('./pages/ProfilePlacements'));
const ElementRealms = lazy(() => import('./pages/ElementRealms'));
const Planets = lazy(() => import('./pages/Planets'));
const PlanetDetail = lazy(() => import('./pages/PlanetDetail'));
const Signs = lazy(() => import('./pages/Signs'));
const SignDetail = lazy(() => import('./pages/SignDetail'));
const Houses = lazy(() => import('./pages/Houses'));
const HouseDetail = lazy(() => import('./pages/HouseDetail'));
const Elements = lazy(() => import('./pages/Elements'));
const ElementDetail = lazy(() => import('./pages/ElementDetail'));
const Aspects = lazy(() => import('./pages/Aspects'));
const AspectDetail = lazy(() => import('./pages/AspectDetail'));
const DignityMatrix = lazy(() => import('./pages/DignityMatrix'));
const AspectWeaver = lazy(() => import('./pages/AspectWeaver'));
const ConfigurationGallery = lazy(() => import('./pages/ConfigurationGallery'));
const DecanDive = lazy(() => import('./pages/DecanDive'));
const ContemplationChamber = lazy(() => import('./pages/ContemplationChamber'));
const Transits = lazy(() => import('./pages/Transits'));
const Pathways = lazy(() => import('./pages/Pathways'));
const GeneKeys = lazy(() => import('./pages/GeneKeys'));
const GeneKeyDetail = lazy(() => import('./pages/GeneKeyDetail'));
const CodonRings = lazy(() => import('./pages/CodonRings'));
const CodonRingDetail = lazy(() => import('./pages/CodonRingDetail'));
const GKSpheres = lazy(() => import('./pages/GKSpheres'));
const GKSphereDetail = lazy(() => import('./pages/GKSphereDetail'));
const GKLines = lazy(() => import('./pages/GKLines'));
const GKSequences = lazy(() => import('./pages/GKSequences'));
const GKSequenceDetail = lazy(() => import('./pages/GKSequenceDetail'));
const AminoAcids = lazy(() => import('./pages/AminoAcids'));
const AminoAcidDetail = lazy(() => import('./pages/AminoAcidDetail'));
const Trigrams = lazy(() => import('./pages/Trigrams'));
const TrigramDetail = lazy(() => import('./pages/TrigramDetail'));
const HumanDesignGates = lazy(() => import('./pages/HumanDesignGates'));
const HumanDesignGateDetail = lazy(() => import('./pages/HumanDesignGateDetail'));
const HumanDesignCenters = lazy(() => import('./pages/HumanDesignCenters'));
const HumanDesignCenterDetail = lazy(() => import('./pages/HumanDesignCenterDetail'));
const HumanDesignChannels = lazy(() => import('./pages/HumanDesignChannels'));
const HumanDesignChannelDetail = lazy(() => import('./pages/HumanDesignChannelDetail'));
const HumanDesignTypes = lazy(() => import('./pages/HumanDesignTypes'));
const HumanDesignTypeDetail = lazy(() => import('./pages/HumanDesignTypeDetail'));
const HumanDesignAuthorities = lazy(() => import('./pages/HumanDesignAuthorities'));
const HumanDesignAuthorityDetail = lazy(() => import('./pages/HumanDesignAuthorityDetail'));
const HumanDesignLines = lazy(() => import('./pages/HumanDesignLines'));
const HumanDesignLineDetail = lazy(() => import('./pages/HumanDesignLineDetail'));
const HumanDesignProfiles = lazy(() => import('./pages/HumanDesignProfiles'));
const HumanDesignProfileDetail = lazy(() => import('./pages/HumanDesignProfileDetail'));
const HumanDesignVariables = lazy(() => import('./pages/HumanDesignVariables'));
const HumanDesignStrategies = lazy(() => import('./pages/HumanDesignStrategies'));
// Unified entities
const Lines = lazy(() => import('./pages/Lines'));
const LineDetail = lazy(() => import('./pages/LineDetail'));
// Sacred UX + Insights
const Onboarding = lazy(() => import('./pages/Onboarding'));
const InsightLibrary = lazy(() => import('./pages/InsightLibrary'));
const SessionsLibrary = lazy(() => import('./pages/SessionsLibrary'));
const LifeAreas = lazy(() => import('./pages/LifeAreas'));
// Wisdom Traditions
const Numerology = lazy(() => import('./pages/Numerology'));
const NumerologyDetail = lazy(() => import('./pages/NumerologyDetail'));
const Chakras = lazy(() => import('./pages/Chakras'));
const ChakraDetail = lazy(() => import('./pages/ChakraDetail'));
const HermeticPrinciples = lazy(() => import('./pages/HermeticPrinciples'));
const HermeticPrincipleDetail = lazy(() => import('./pages/HermeticPrincipleDetail'));
// Profile entity detail pages
const ProfilePlacementDetail = lazy(() => import('./pages/profile/ProfilePlacementDetail'));
const ProfileAspectDetail = lazy(() => import('./pages/profile/ProfileAspectDetail'));
const ProfileConfigurationDetail = lazy(() => import('./pages/profile/ProfileConfigurationDetail'));
const ProfileGKPlacementDetail = lazy(() => import('./pages/profile/ProfileGKPlacementDetail'));
const ProfileHDPlacementDetail = lazy(() => import('./pages/profile/ProfileHDPlacementDetail'));
const ProfileHDChannelDetail = lazy(() => import('./pages/profile/ProfileHDChannelDetail'));

function App() {
  return (
    <ErrorBoundary>
    <MotionConfig reducedMotion="user">
    <AuthProvider>
    <ProfileProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSkeleton variant="page" />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="wheel" element={<Wheel />} />
              <Route path="graph" element={<Graph />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/placements" element={<ProfilePlacements />} />
              <Route path="profile/astrology" element={<ProfileAstrology />} />
              <Route path="profile/astrology/placements/:planetId" element={<ProfilePlacementDetail />} />
              <Route path="profile/astrology/aspects/:aspectId" element={<ProfileAspectDetail />} />
              <Route path="profile/astrology/configurations/:configId" element={<ProfileConfigurationDetail />} />
              <Route path="profile/gene-keys" element={<ProfileGeneKeys />} />
              <Route path="profile/gene-keys/:sphereId" element={<ProfileGKPlacementDetail />} />
              <Route path="profile/human-design" element={<ProfileHumanDesign />} />
              <Route path="profile/human-design/gates/:gateId" element={<ProfileHDPlacementDetail />} />
              <Route path="profile/human-design/channels/:channelId" element={<ProfileHDChannelDetail />} />
                <Route path="realms" element={<ElementRealms />} />
                <Route path="planets" element={<Planets />} />
                <Route path="planets/:id" element={<PlanetDetail />} />
                <Route path="signs" element={<Signs />} />
                <Route path="signs/:id" element={<SignDetail />} />
                <Route path="houses" element={<Houses />} />
                <Route path="houses/:id" element={<HouseDetail />} />
                <Route path="elements" element={<Elements />} />
                <Route path="elements/:id" element={<ElementDetail />} />
                <Route path="aspects" element={<Aspects />} />
                <Route path="aspects/:id" element={<AspectDetail />} />
                <Route path="dignities" element={<DignityMatrix />} />
                <Route path="weaver" element={<AspectWeaver />} />
                <Route path="configurations" element={<ConfigurationGallery />} />
                <Route path="decans" element={<DecanDive />} />
                <Route path="contemplate" element={<ContemplationChamber />} />
                <Route path="transits" element={<Transits />} />
                <Route path="pathways" element={<Pathways />} />
                {/* Gene Keys - specific routes before dynamic :id */}
                <Route path="gene-keys/codon-rings" element={<CodonRings />} />
                <Route path="gene-keys/codon-rings/:id" element={<CodonRingDetail />} />
                <Route path="gene-keys/spheres" element={<GKSpheres />} />
                <Route path="gene-keys/spheres/:id" element={<GKSphereDetail />} />
                <Route path="gene-keys/lines" element={<GKLines />} />
                <Route path="gene-keys/sequences" element={<GKSequences />} />
                <Route path="gene-keys/sequences/:id" element={<GKSequenceDetail />} />
                <Route path="gene-keys/amino-acids" element={<AminoAcids />} />
                <Route path="gene-keys/amino-acids/:id" element={<AminoAcidDetail />} />
                <Route path="gene-keys/trigrams" element={<Trigrams />} />
                <Route path="gene-keys/trigrams/:id" element={<TrigramDetail />} />
                <Route path="gene-keys/:id" element={<GeneKeyDetail />} />
                <Route path="gene-keys" element={<GeneKeys />} />
                {/* Human Design - specific routes before dynamic :id */}
                <Route path="human-design/centers" element={<HumanDesignCenters />} />
                <Route path="human-design/centers/:id" element={<HumanDesignCenterDetail />} />
                <Route path="human-design/channels" element={<HumanDesignChannels />} />
                <Route path="human-design/channels/:id" element={<HumanDesignChannelDetail />} />
                <Route path="human-design/types" element={<HumanDesignTypes />} />
                <Route path="human-design/types/:id" element={<HumanDesignTypeDetail />} />
                <Route path="human-design/authorities" element={<HumanDesignAuthorities />} />
                <Route path="human-design/authorities/:id" element={<HumanDesignAuthorityDetail />} />
                <Route path="human-design/lines" element={<HumanDesignLines />} />
                <Route path="human-design/lines/:id" element={<HumanDesignLineDetail />} />
                <Route path="human-design/profiles" element={<HumanDesignProfiles />} />
                <Route path="human-design/profiles/:id" element={<HumanDesignProfileDetail />} />
                <Route path="human-design/variables" element={<HumanDesignVariables />} />
                <Route path="human-design/strategies" element={<HumanDesignStrategies />} />
                <Route path="human-design/:id" element={<HumanDesignGateDetail />} />
                <Route path="human-design" element={<HumanDesignGates />} />
                {/* Unified entities (spanning GK + HD) */}
                <Route path="lines" element={<Lines />} />
                <Route path="lines/:id" element={<LineDetail />} />
                {/* Sacred UX + Insights */}
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="insights" element={<InsightLibrary />} />
                <Route path="sessions" element={<SessionsLibrary />} />
                <Route path="life-areas" element={<LifeAreas />} />
                {/* Wisdom Traditions */}
                <Route path="numerology" element={<Numerology />} />
                <Route path="numerology/:id" element={<NumerologyDetail />} />
                <Route path="chakras" element={<Chakras />} />
                <Route path="chakras/:id" element={<ChakraDetail />} />
                <Route path="hermetic" element={<HermeticPrinciples />} />
                <Route path="hermetic/:id" element={<HermeticPrincipleDetail />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </ProfileProvider>
    </AuthProvider>
    </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
