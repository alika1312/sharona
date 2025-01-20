import React, { useState, useRef } from "react";

const WorkshopCard = ({ title, image, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg shadow-lg bg-white p-4 flex flex-col text-right hover:shadow-xl transition-shadow ">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-36 object-cover rounded-md mb-3"
        />
      )}
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <div
        ref={descriptionRef}
        className={`text-sm text-gray-600 mb-4 ${
          isExpanded ? "" : "line-clamp-3 overflow-hidden"
        }`}
      >
        {description}
      </div>
      <button
        onClick={handleToggle}
        className="self-start bg-palette-brown hover:bg-palette-lightPink text-white text-sm px-3 py-1 rounded-lg  transition"
      >
        {isExpanded ? "קרא פחות" : "קרא עוד"}
      </button>
    </div>
  );
};

export default WorkshopCard;
