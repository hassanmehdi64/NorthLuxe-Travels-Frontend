import React from "react";

const defaultDestinations = [
  "Hunza Valley",
  "Skardu City",
  "Attabad Lake",
  "Khunjerab Pass",
  "Fairy Meadows",
  "Deosai National Park",
  "Shangrila Resort",
  "Naltar Valley",
];

const DestinationInput = ({ value, setValue, destinations = defaultDestinations }) => {

  return (
    <div className="relative w-full">

      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full appearance-none bg-main border  text-main rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-200"
        >
          <option value="" disabled>
            Where do you want to go?
          </option>
          {destinations.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DestinationInput;
