import React, { useEffect, useState } from "react";

const Profile = () => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isPhoneSize, setIsPhoneSize] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)"); // Adjust the breakpoint as needed
    const handleResize = () => setIsPhoneSize(mediaQuery.matches);

    // Initialize state and add listener
    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/showcase1.png"; // Replace with your image path
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, []);

  return (
    <>
      {isPhoneSize ? (
        <section className="relative mx-auto w-full max-w-screen-lg flex items-center justify-center overflow-hidden rounded-lg shadow-md">
          <img
            src="shronaPhone1.png"
            alt="Showcase"
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-0 w-full border-t-4 border-gray-300"></div>
        </section>
      ) : (
        <section
          className="relative mx-auto w-fit"
          style={{
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
            backgroundImage: "url('/showcase1.png')",
            backgroundSize: "contain", // Ensures the entire image is visible
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Border or Line at the Bottom */}
          <div className="absolute bottom-0 w-full border-t-4 border-gray-300"></div>

          {/* Optional Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 text-center"></div>
        </section>
      )}
    </>
  );
};

export default Profile;
