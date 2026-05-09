import FeatureCourse from "../components/Home/FeatureCourse/FeatureCourse";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import HomeCategories from "../components/Home/HomeCategories/HomeCategories";
import HowItWorks from "../components/Home/HowItWorks/HowItWorks";
import NewsletterCTA from "../components/Home/NewsletterCTA/NewsletterCTA";
import StartLearning from "../components/Home/StartLearning/StartLearning";
import StatsSection from "../components/Home/StatsSection/StatsSection";
import Testimonials from "../components/Home/Testimonials/Testimonials";
import TopInstructors from "../components/Home/TopInstructors/TopInstructors";
import TrustedCompanies from "../components/Home/TrustedCompanies/TrustedCompanies";

export default async function Home() {
  return (
    <>
      {/* 1 */}
      <HeroBanner />
      {/* 2 */}
      <TrustedCompanies />
      {/* 3 */}
      <StatsSection />
      {/* 4 */}
      <StartLearning />
      {/* 5 */}
      <HomeCategories />
      {/* 6 */}
      <HowItWorks />
      {/* 7 */}
      <FeatureCourse />
      {/* 8 */}
      <TopInstructors />
      {/* 9 */}
      <Testimonials />
      {/* 10 */}
      <NewsletterCTA />
    </>
  );
}
