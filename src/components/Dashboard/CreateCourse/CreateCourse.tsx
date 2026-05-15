"use client";
import { IoInformationCircleOutline } from "react-icons/io5";

const CreateCourse = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
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
              <h3 className=" font-semibold">Basic Info</h3>
            </div>
            <div></div>
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
