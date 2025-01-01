import { useEffect, useState } from "react";

const useLocation = (defaultLocation: { lat: number; lon: number }) => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const newYorkLocation = { lat: 40.7282, lon: -73.7949 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          setErrorMessage("Unable to fetch location. Using default location.");
          console.error("Geolocation error:", error);
          setLocation(newYorkLocation);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
      setLocation(newYorkLocation);
    }
  }, [defaultLocation]);

  return { location, errorMessage };
};

export default useLocation;
