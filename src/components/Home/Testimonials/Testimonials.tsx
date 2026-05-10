"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Frontend Developer",
    company: "Google",
    avatar: "SM",
    avatarBg: "bg-blue-500",
    rating: 5,
    text: "This platform completely transformed my career. The courses are incredibly well-structured and the instructors are world-class. I landed my dream job at Google within 3 months of completing the web dev bootcamp.",
  },
  {
    id: 2,
    name: "James Okafor",
    role: "UX Designer",
    company: "Airbnb",
    avatar: "JO",
    avatarBg: "bg-purple-500",
    rating: 5,
    text: "The UI/UX masterclass was a game changer. Real-world projects, detailed feedback, and a community that actually helps. I went from zero design experience to a full-time role at Airbnb.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Data Scientist",
    company: "Netflix",
    avatar: "PS",
    avatarBg: "bg-pink-500",
    rating: 5,
    text: "I've tried many online learning platforms but nothing comes close to the depth and quality here. The data science track is comprehensive and the projects are exactly what employers look for.",
  },
  {
    id: 4,
    name: "Carlos Rivera",
    role: "Full Stack Engineer",
    company: "Shopify",
    avatar: "CR",
    avatarBg: "bg-green-500",
    rating: 5,
    text: "Went from a complete beginner to building production-ready apps in 6 months. The step-by-step approach and mentor support made all the difference. Highly recommend to anyone serious about coding.",
  },
  {
    id: 5,
    name: "Emily Chen",
    role: "Product Manager",
    company: "Meta",
    avatar: "EC",
    avatarBg: "bg-orange-500",
    rating: 5,
    text: "The business and leadership courses gave me the strategic mindset I needed to transition into product management. The content is practical, not just theoretical. Worth every penny.",
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    role: "Mobile Developer",
    company: "Uber",
    avatar: "AH",
    avatarBg: "bg-indigo-500",
    rating: 5,
    text: "Outstanding learning experience. The mobile development course covered everything from basics to advanced patterns. The community forums and live Q&A sessions are incredibly valuable.",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleCount = 3;

  // previous
  const prev = () => {
    setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  // next
  const next = () => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  };

  const visible = Array.from(
    { length: visibleCount },
    (_, i) => testimonials[(activeIndex + i) % testimonials.length],
  );

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Learners Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-xl mx-auto">
            Real results from real people. Join thousands whove already
            transformed their careers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {visible.map((t, i) => (
            <div
              key={t.id}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-7 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-500 ${
                i === 1
                  ? "md:scale-105 shadow-xl border-blue-200 dark:border-blue-700"
                  : "opacity-80"
              }`}
            >
              {/* Quote icon */}
              <Quote
                size={32}
                className="text-blue-200 dark:text-blue-800 mb-4"
                fill="currentColor"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div
                  className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 dark:text-gray-300 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 dark:text-gray-300 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
