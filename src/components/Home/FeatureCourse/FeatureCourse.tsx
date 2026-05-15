import Image from "next/image";
import React from "react";

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    description: "Master HTML, CSS, React, and Node.js from scratch.",
    category: "Development",
    instructor: "Dr. Angela Yu",
    rating: 4.9,
    review_count: "12k",
    price: 89.99,
    badge: "BESTSELLER",
    categoryColor: "bg-blue-100 text-blue-600",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Advanced UI/UX Masterclass for Digital Products",
    description: "Learn high-end design principles and prototyping.",
    category: "Design",
    instructor: "Sarah Jenkins",
    rating: 4.7,
    review_count: "8k",
    price: 124.0,
    badge: "NEW",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAu8ThEgGwWiffHaf1sQsKvIpeyTGsvQTX7h03W6g_f8hakivV-42wOopkN9aEObuwj4x81_kP5b1V01k-wa7rtbAmHmTbmLN2c5ogo2CUXWETXQE8Uvw7-BQcbB8n7DoxAdWH9RJlRHbufctfPuLgEfneoxZh-N5a2zZBtJ5bWGwDEsiLZokKfkbtH0Lqa600PopvuJSTvcYNAuRln_71x2s6FwLY3nH1CiqJnct5QWbK7ZVFoFKYigAiUxCyGo6gKqDhMaXuYoME",
  },
  {
    id: 3,
    title: "Strategic Leadership: Building Scalable Startups",
    description: "A comprehensive guide for entrepreneurs.",
    category: "Business",
    instructor: "Marcus Thorne",
    rating: 4.8,
    review_count: "15k",
    price: 150.0,
    badge: null,
    categoryColor: "bg-orange-100 text-orange-600",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
];

const FeatureCourse = () => {
  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-20 px-4">
        {/* Header Section */}
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-gray-900">Featured Courses</h3>
          <p className="text-gray-500 mt-2 text-lg">
            Hand-picked selections by our educational editors
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              {/* Image Section - Fixed Height added */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {course.badge && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-md z-10">
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${course.categoryColor}`}
                  >
                    {course.category}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-bold mr-1">★</span>
                    <span className="text-gray-800 font-medium text-sm">
                      {course.rating}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">
                      ({course.review_count})
                    </span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {course.title}
                </h4>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-auto">
                  <hr className="border-gray-100 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 overflow-hidden">
                        {/* Initials instead of empty div for better look */}
                        <span className="text-[10px] font-bold text-blue-600">
                          {course.instructor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {course.instructor}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-700">
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCourse;
