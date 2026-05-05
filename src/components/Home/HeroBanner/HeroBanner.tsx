"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

const HeroBanner = () => {
  const carouselData = [
    {
      id: 1,
      title: "Modern Web Development",
      description:
        "Learn how to build fast and scalable web applications using Next.js, Tailwind CSS, and modern tools.",
      image:
        "https://cdn.pixabay.com/photo/2020/10/17/15/14/girl-5662435_1280.jpg",
    },
    {
      id: 2,
      title: "UI/UX Design Mastery",
      description:
        "Design beautiful and user-friendly interfaces with best practices in UI/UX and modern design systems.",
      image:
        "https://cdn.pixabay.com/photo/2021/03/02/13/04/laptop-6062423_1280.jpg",
    },
    {
      id: 3,
      title: "Full Stack Projects",
      description:
        "Build complete full stack applications with authentication, database integration, and APIs.",
      image:
        "https://cdn.pixabay.com/photo/2015/12/03/02/21/child-1073638_1280.jpg",
    },
    // {
    //   id: 4,
    //   title: "JavaScript Deep Dive",
    //   description:
    //     "Understand core JavaScript concepts like closures, async/await, and advanced patterns.",
    //   image:
    //     "https://pixabay.com/get/g649390234a98402432a6886866992d997239719468945686526806f8906969566378e078709322676751227092301097_1280.jpg",
    // },
    // {
    //   id: 5,
    //   title: "Career & Interview Prep",
    //   description:
    //     "Prepare for developer interviews with real-world coding challenges and system design tips.",
    //   image:
    //     "https://pixabay.com/get/gd1e51f89395561a0f900693a005f7783068e217088927005068f0f089694769062363722976936306560938495029671_1280.jpg",
    // },
  ];

  return (
    <div className=" w-full max-w-7xl mx-auto  py-8">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {carouselData.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden rounded-xl">
                {/* Image Component */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={item.id === 1} // প্রথম ছবিটির জন্য প্রায়োরিটি লোডিং
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 md:px-16 text-white">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    {item.title}
                  </h2>
                  <p className="text-sm md:text-lg max-w-xl text-gray-200">
                    {item.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default HeroBanner;
