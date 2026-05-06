"use client ";
import {
  Code2,
  Banknote,
  Palette,
  TrendingUp,
  Camera,
  Music,
} from "lucide-react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const categories = [
  {
    id: 1,
    title: "Development",
    icon: <Code2 size={32} color="#3b82f6" />,
    bgColor: "#eff6ff", // হালকা নীল ব্যাকগ্রাউন্ড
  },
  {
    id: 2,
    title: "Business",
    icon: <Banknote size={32} color="#f59e0b" />,
    bgColor: "#fffbeb", // হালকা কমলা ব্যাকগ্রাউন্ড
  },
  {
    id: 3,
    title: "Design",
    icon: <Palette size={32} color="#8b5cf6" />,
    bgColor: "#f5f3ff", // হালকা বেগুনি ব্যাকগ্রাউন্ড
  },
  {
    id: 4,
    title: "Marketing",
    icon: <TrendingUp size={32} color="#10b981" />,
    bgColor: "#ecfdf5", // হালকা গ্রিন ব্যাকগ্রাউন্ড
  },
  {
    id: 5,
    title: "Photography",
    icon: <Camera size={32} color="#ef4444" />,
    bgColor: "#fef2f2", // হালকা লাল ব্যাকগ্রাউন্ড
  },
  {
    id: 6,
    title: "Music",
    icon: <Music size={32} color="#6366f1" />,
    bgColor: "#eef2ff", // হালকা ইন্ডিগো ব্যাকগ্রাউন্ড
  },
];

const HomeCategories = () => {
  return (
    <section className="w-full bg-primary/10 py-20 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between   items-end">
          <div>
            <h2 className="text-xl font-bold">Explore Top Categories</h2>
            <p className="text-gray-500">Find the path that's for you</p>
          </div>
          <div className="flex  items-center gap-2  text-blue-600 hover:text-primary">
            <Link href="/allcategories">All Categories</Link>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
