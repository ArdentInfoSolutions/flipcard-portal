"use client";

import React, { useState, useEffect, useRef } from "react";

interface LocationSuggestion {
  name: string;
  lat: number;
  lon: number;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface LocationSearchProps {
  initialValue?: string;
  onSelect: (location: LocationSuggestion) => void; // Full location object
}

export function LocationSearch({ initialValue = "", onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        console.log("Location API response:", data); 
        setSuggestions(data.data || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (location: LocationSuggestion) => {
    setQuery(location.name); // show name in input
    setShowSuggestions(false);
    onSelect(location); // send full object to parent
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name="place"
        id="place"
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Enter location"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md p-2 text-sm text-gray-500">
          Loading...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-b-md z-10">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2"
              onMouseDown={() => handleSelect(item)} // full object passed here
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// "use client";

// import React, { useState, useEffect, useRef } from "react";

// interface LocationSearchProps {
//   initialValue?: string;
//   onSelect: (location: string) => void;
// }

// interface LocationSuggestion {
//   name: string;
//   lat: string;
//   lon: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postcode?: string;
// }

// export function LocationSearch({ initialValue = "", onSelect }: LocationSearchProps) {
//   const [query, setQuery] = useState(initialValue);
//   const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (!query.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     setIsLoading(true);

//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

//     debounceTimeout.current = setTimeout(async () => {
//       try {
//         const res = await fetch(`/api/location?query=${encodeURIComponent(query)}`);
//         if (!res.ok) throw new Error("Failed to fetch locations");
//         const data = await res.json();
//         setSuggestions(data.data || []);
//       } catch (error) {
//         console.error(error);
//         setSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 300); // debounce 300ms
//   }, [query]);

//   const handleSelect = (location: string) => {
//     setQuery(location);
//     setShowSuggestions(false);
//     onSelect(location);
//   };

//   return (
//     <div className="relative w-full">
//       <input
//         type="text"
//         name="place"
//         id="place"
//         className="w-full border border-gray-300 rounded-md p-2"
//         placeholder="Enter location"
//         value={query}
//         onChange={(e) => {
//           setQuery(e.target.value);
//           setShowSuggestions(true);
//         }}
//         onFocus={() => setShowSuggestions(true)}
//         onBlur={() => {
//           setTimeout(() => setShowSuggestions(false), 150); // delay to allow click
//         }}
//         autoComplete="off"
//       />
//       {isLoading && (
//         <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md p-2 text-sm text-gray-500">
//           Loading...
//         </div>
//       )}
//       {showSuggestions && suggestions.length > 0 && (
//         <ul className="absolute top-full left-0 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-b-md z-10">
//           {suggestions.map((item, idx) => (
//             <li
//               key={idx}
//               className="cursor-pointer hover:bg-gray-100 px-3 py-2"
//               onMouseDown={() => handleSelect(item.name)}
//             >
//               {item.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
