import { useEffect, useState } from "react";

const useLocation = (defaultLocation: { lat: number; lon: number }) => {
  const [location, setLocation] = useState<{ lat: number; lon: number }>(defaultLocation);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  }, [defaultLocation]);

  return { location, errorMessage };
};

export default useLocation;

// adds comment for rendering 