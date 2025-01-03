import { useEffect, useState } from "react";
import useData from "./useData";

interface LocationData {
  name: string;
  local_names?: {
    [key: string]: string;
  };
  country: string;
}

interface GeoCodingProps {
  lat: number;
  lon: number;
}

const useGeoCoding = ({ lat, lon }: GeoCodingProps) => {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [geoErrorMessage, setGeoErrorMessage] = useState<string | null>(null);

  const { data, error, isLoading } = useData<LocationData[]>(
    "/geo/1.0/reverse",
    {
      params: {
        lat,
        lon,
      },
    }
  );

  useEffect(() => {
    if (error) {
      setGeoErrorMessage("Failed to fetch location name.");
    } else if (data && data.length > 0) {
      setLocationName(data[0].name);
    }
  }, [data, error]);

  return { locationName, geoErrorMessage, isLoading };
};

export default useGeoCoding;
