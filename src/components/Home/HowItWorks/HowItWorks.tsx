import { UserPlus, Search, PlayCircle, BadgeCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <UserPlus size={26} className="text-blue-600" />,
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
    title: "Create Your Account",
    description:
      "Sign up for free in seconds. No credit card required to get started.",
  },
  {
    step: "02",
    icon: <Search size={26} className="text-purple-600" />,
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-purple-200 dark:border-purple-800",
    title: "Browse & Choose",
    description:
      "Explore thousands of courses across every skill level and category.",
  },
  {
    step: "03",
    icon: <PlayCircle size={26} className="text-green-600" />,
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-800",
    title: "Learn at Your Pace",
    description:
      "Watch on any device, pause and resume anytime. Learning fits your schedule.",
  },
  {
    step: "04",
    icon: <BadgeCheck size={26} className="text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-900/30",
    border: "border-orange-200 dark:border-orange-800",
    title: "Earn Your Certificate",
    description:
      "Complete the course and receive a shareable certificate to boost your career.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
            From sign-up to certification — four simple steps to transform your
            skills.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 dark:from-blue-800 dark:via-purple-800 dark:to-orange-800" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div
                  className={`relative w-24 h-24 rounded-full ${s.bg} border-2 ${s.border} flex items-center justify-center mb-5 z-10`}
                >
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
