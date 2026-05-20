"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ImagePlus,
  Info,
  LayoutList,
  Tag,
  Upload,
} from "lucide-react";
import CurriculumBuilder from "../../Draft/CurriculamBuilder";

const CATEGORIES = [
  "Design",
  "Development",
  "Business",
  "Marketing",
  "Photography",
  "Music",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const LANGUAGES = ["English", "Bengali", "Hindi", "Spanish", "French"];

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseTitle: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    language: "",
    tags: "",
    price: "",
    thumbnail: null as File | null,
    thumbnailPreview: "",
  });

  const [activeTab, setActiveTab] = useState<
    "basic" | "curriculum" | "pricing"
  >("basic");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Course creation is currently in development.");
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Info size={15} /> },
    { id: "curriculum", label: "Curriculum", icon: <LayoutList size={15} /> },
    { id: "pricing", label: "Pricing", icon: <Tag size={15} /> },
  ] as const;

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400";

  const selectClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer";

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <form onSubmit={handleSubmit}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Course
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details to publish your course.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
            >
              Publish Course
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <>
                {/* Basic Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Info size={16} className="text-blue-600" />
                    </div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Basic Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <fieldset>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="courseTitle"
                        value={formData.courseTitle}
                        onChange={handleChange}
                        placeholder="e.g. Complete Web Development Bootcamp"
                        className={inputClass}
                        required
                      />
                    </fieldset>

                    <fieldset>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="A short, catchy subtitle for your course"
                        className={inputClass}
                      />
                    </fieldset>

                    <fieldset>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What will students learn? What are the prerequisites?"
                        rows={6}
                        className={`${inputClass} resize-none`}
                        required
                      />
                    </fieldset>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <fieldset>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={selectClass}
                            required
                          >
                            <option value="" disabled>
                              Select category
                            </option>
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </fieldset>

                      <fieldset>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Level
                        </label>
                        <div className="relative">
                          <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className={selectClass}
                          >
                            <option value="" disabled>
                              Select level
                            </option>
                            {LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </fieldset>

                      <fieldset>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Language
                        </label>
                        <div className="relative">
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className={selectClass}
                          >
                            <option value="" disabled>
                              Select language
                            </option>
                            {LANGUAGES.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </fieldset>
                    </div>

                    <fieldset>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Topic Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. React, JavaScript, CSS (comma separated)"
                        className={inputClass}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Separate tags with commas
                      </p>
                    </fieldset>
                  </div>
                </div>
              </>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Course Curriculum
                  </h2>
                </div>
                <CurriculumBuilder />
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <Tag size={16} className="text-green-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Pricing
                  </h2>
                </div>

                <fieldset className="max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Course Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Set to 0 for a free course
                  </p>
                </fieldset>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-72 shrink-0 space-y-5">
            {/* Thumbnail Upload */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ImagePlus size={15} className="text-blue-600" />
                Course Thumbnail
              </h3>

              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="hidden"
                />
                {formData.thumbnailPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Upload size={18} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Click to upload thumbnail
                      <br />
                      <span className="text-gray-400">PNG, JPG up to 2MB</span>
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Course Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Course Summary
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Title", value: formData.courseTitle || "—" },
                  { label: "Category", value: formData.category || "—" },
                  { label: "Level", value: formData.level || "—" },
                  { label: "Language", value: formData.language || "—" },
                  {
                    label: "Price",
                    value: formData.price ? `$${formData.price}` : "—",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex justify-between gap-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-right truncate max-w-[140px]">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                💡 Tips for a great course
              </h3>
              <ul className="space-y-2 text-xs text-blue-600 dark:text-blue-300">
                <li>• Use a clear, descriptive title</li>
                <li>• Add a high-quality thumbnail</li>
                <li>• Structure your curriculum logically</li>
                <li>• Set a competitive price</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreateCourse;
