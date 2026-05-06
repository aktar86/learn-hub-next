// import { getServerSession } from "next-auth";
// import TestSession from "../components/TestSession/TestSession";
// import { authOptions } from "../lib/authOptions";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import HomeCategories from "../components/Home/HomeCategories/HomeCategories";
import StartLearning from "../components/Home/StartLearning/StartLearning";
import TrustedCompanies from "../components/Home/TrustedCompanies/TrustedCompanies";
// import ThemeToggle from "../components/NextThemeProvider/ThemeToggle";

// const session = await getServerSession(authOptions);

export default async function Home() {
  return (
    <>
      <HeroBanner />
      <TrustedCompanies />
      <StartLearning />
      <HomeCategories />
    </>
  );
}

//  <h1>Home page here</h1>
//     <div className="border mb-10 border-amber-300">
//       <h1>Server Session</h1>
//       <p>{JSON.stringify(session)}</p>
//     </div>
//     <div className="border">
//       <TestSession></TestSession>
//     </div>
//     <hr />
