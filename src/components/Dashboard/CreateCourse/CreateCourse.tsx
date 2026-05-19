"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseTitle: "",
    subtitle: "",
    description: "",
    category: "",
    tags: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert("this feature is now in develpment phage");
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        {/* top section */}
        <div className="w-full flex justify-between items-end">
          <div>
            <h4>Create New Course</h4>
            <p className="text-gray-600">
              Fill in the details below to design your academic masterpiece.
            </p>
          </div>
          {/* btn  */}
          <div className="space-x-2">
            <button className="btn-outline"> save draft</button>

            <input
              type="submit"
              value="Publish Course "
              className="btn-primary"
            />
          </div>
        </div>

        {/* form */}

        <div className="w-full flex justify-between gap-5 pt-10 ">
          {/* left */}
          <div className="border flex-3 p-5">
            <div className="flex items-center gap-2">
              <IoInformationCircleOutline className="size-6 text-primary" />
              <h3 className=" ">Basic Info</h3>
            </div>
            {/* title */}
            <fieldset className="my-5">
              <label className="block mb-2">Course Title</label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2  text-black
                 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </fieldset>

            {/* SubTitle */}
            <fieldset className="my-5">
              <label className="block mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Subtitle"
                className="w-full p-2  text-black
                 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </fieldset>

            {/* description */}
            <fieldset className="space-y-2">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-[#004ac6] transition-all p-3"
                placeholder="What will students learn in this course?"
                rows={10}
              />
            </fieldset>

            {/* category and topic */}
            <div className="mt-5 flex justify-between items-center gap-4">
              <fieldset className="w-full">
                <label htmlFor="category" className="block mb-2 ">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2  text-black
                 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </fieldset>

              {/* Topic Tags */}
              <fieldset className="w-full">
                <label className="block mb-2 ">Topic Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2  text-black
                 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Figma, UI, Layout"
                />
              </fieldset>
            </div>
          </div>
          {/* right */}
          <div className="border flex-2">
            <h1>Right</h1>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreateCourse;
