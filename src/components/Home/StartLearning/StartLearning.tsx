"use client";
import { Search, BookOpen, Award } from "lucide-react";

const StartLearning = () => {
  const coursesData = [
    {
      id: 1,
      icon: <Search size={24} />,
      title: "Find Your Course",
      description:
        "Choose from over 100k+ expert-led courses across dozens of categories.",
    },
    {
      id: 2,
      icon: <BookOpen size={24} />,
      title: "Learn at Your Pace",
      description:
        "Access content on any device, anytime. High-quality video and interactive assignments.",
    },
    {
      id: 3,
      icon: <Award size={24} />,
      title: "Get Certified",
      description:
        "Earn industry-recognized certificates to showcase your new expertise.",
    },
  ];
  return (
    <section className="py-10 w-full max-w-7xl mx-auto">
      <div className="text-center space-y-2  py-10">
        <h3 className="text-xl font-bold">Start Learning in 3 Easy Steps</h3>
        <p className="text-lg text-gray-500 dark:text-white">
          Everything you need to succeed, simplified.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coursesData.map((c, i) => (
          <div key={c.id} className=" py-5">
            <div className="w-10 h-20 mx-auto bg-primary/10 text-primary hover:bg-primary hover:text-white flex justify-center items-center p-10 border rounded-3xl">
              <span>{c.icon}</span>
            </div>
            <div className="text-center mt-5 space-y-2">
              <h3 className="text-xl font-bold">
                {i + 1}. {c.title}
              </h3>
              <p className="text-gray-500">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StartLearning;
