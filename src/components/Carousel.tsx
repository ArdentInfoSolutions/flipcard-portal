import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const Carousel = () => {
  const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
      "/images/image3.jpg",
    "/images/image4.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Randomized time for image change (in milliseconds)
  const getRandomTime = () => Math.floor(Math.random() * 3000) + 2000; // Between 2 and 5 seconds

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(handleNext, getRandomTime()); // Change slide every 3 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [isPlaying, handleNext]);

  // Handle progress bar animation
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = "width 3s linear";
      progressBarRef.current.style.width = "100%";
      setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.style.width = "0%";
        }
      }, 0);
    }
  }, [currentIndex]);

  // Pause progress bar when user interacts
  const handleImageClick = () => {
    setIsPlaying(!isPlaying); // Toggle play/pause on click
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Indicators on top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-8 h-1 ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>

      {/* Image Container */}
      <div className="flex transition-transform duration-500 ease-in-out">
        {images.map((image, index) => (
          <div
            key={index}
            className={`${
              index === currentIndex ? "block" : "hidden"
            } w-full h-full relative`}
            onClick={handleImageClick}
          >
            <Image
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            width={400}
            height={400}
            className={`${
              index === currentIndex ? "block" : "hidden"
            } w-full h-auto`}
          />
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-1 bg-blue-500"
        style={{ width: "0%" }}
      ></div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &#8592;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Carousel;