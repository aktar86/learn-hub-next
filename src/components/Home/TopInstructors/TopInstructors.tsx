import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Star } from "lucide-react";

const instructors = [
  {
    id: 1,
    name: "Dr. Angela Yu",
    specialty: "Web Development",
    students: "1.2M",
    courses: 12,
    rating: 4.9,
    avatar: "AY",
    avatarBg: "bg-blue-500",
    badge: "Top Rated",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    specialty: "UI/UX Design",
    students: "840K",
    courses: 8,
    rating: 4.8,
    avatar: "SJ",
    avatarBg: "bg-purple-500",
    badge: "Expert",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  },
  {
    id: 3,
    name: "Marcus Thorne",
    specialty: "Business & Leadership",
    students: "620K",
    courses: 6,
    rating: 4.9,
    avatar: "MT",
    avatarBg: "bg-orange-500",
    badge: "Bestseller",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
  {
    id: 4,
    name: "Lena Park",
    specialty: "Data Science & AI",
    students: "980K",
    courses: 10,
    rating: 4.9,
    avatar: "LP",
    avatarBg: "bg-pink-500",
    badge: "Top Rated",
    badgeColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
  },
];

const TopInstructors = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3">
              Learn from the Best
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Top Instructors
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Industry experts who bring real-world experience to every lesson.
            </p>
          </div>
          <Link
            href="/instructors"
            className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-center group"
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div
                  className={`w-20 h-20 rounded-full ${inst.avatarBg} flex items-center justify-center text-white text-2xl font-bold mx-auto ring-4 ring-white dark:ring-gray-800 group-hover:ring-blue-100 transition-all`}
                >
                  {inst.avatar}
                </div>
              </div>

              {/* Badge */}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${inst.badgeColor}`}>
                {inst.badge}
              </span>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                {inst.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {inst.specialty}
              </p>

              {/* Stats row */}
              <div className="flex justify-around text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{inst.students}</p>
                  <p className="text-xs text-gray-400">Students</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{inst.courses}</p>
                  <p className="text-xs text-gray-400">Courses</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-0.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {inst.rating}
                  </p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopInstructors;
