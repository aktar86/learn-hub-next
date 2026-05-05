import React from "react";

const TrustedCompanies = () => {
  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Microsoft",
    "Google",
    "Xiaomi",
    "OnePlus",
    "Huawei",
    "Canon",
    "Nikon",
    "Bose",
    "JBL",
    "Logitech",
    "Razer",
    "Corsair",
  ];

  return (
    <section className="py-12  max-w-7xl mx-auto overflow-hidden ">
      <div className="container mx-auto px-4">
        {/* Header Text */}
        <p className="text-center text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-10">
          Trusted by over 15,000 companies worldwide
        </p>

        {/* Logos Wrapper */}
        <div className="flex gap-4 animate-scroll">
          {/* Duplicate brands for seamless loop */}
          {brands.map((brand, index) => (
            <div
              key={index}
              className="shrink-0 w-45 h-25   flex items-center justify-center  transition"
            >
              <span className="text-4xl font-black text-gray-500 dark:text-gray-200">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
