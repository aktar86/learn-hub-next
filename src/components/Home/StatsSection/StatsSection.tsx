import { Users, BookOpen, Globe, Award } from "lucide-react";

const stats = [
  {
    icon: <Users size={28} className="text-blue-600" />,
    bg: "bg-blue-50 dark:bg-blue-900/30",
    value: "500K+",
    label: "Active Learners",
  },
  {
    icon: <BookOpen size={28} className="text-purple-600" />,
    bg: "bg-purple-50 dark:bg-purple-900/30",
    value: "10,000+",
    label: "Expert Courses",
  },
  {
    icon: <Globe size={28} className="text-green-600" />,
    bg: "bg-green-50 dark:bg-green-900/30",
    value: "150+",
    label: "Countries Reached",
  },
  {
    icon: <Award size={28} className="text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-900/30",
    value: "98%",
    label: "Satisfaction Rate",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center mb-5`}>
                {s.icon}
              </div>
              <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {s.value}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
