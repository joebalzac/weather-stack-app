import { Card, Flex, Text } from "@chakra-ui/react";
import useData from "../hooks/useData";
import { FaCloud } from "react-icons/fa";
import useLocation from "../hooks/useLocation";
import useGeoCoding from "../hooks/useGeoCoding";

interface WeatherData {
  current: {
    temp: number;
    observation_time: string;
    weather_icons: string[];
    feels_like: number;
    pressure: number;
    wind_speed: number;
    humidity: number;
    weather: {
      main: string;
      description: string;
    };
  };
}

const WeatherCard = () => {
  const newYorkLocation = { lat: 40.7282, lon: -73.7949 };
  const { location, errorMessage } = useLocation(newYorkLocation);
  const { locationName, geoErrorMessage } = useGeoCoding({
    lat: location?.lat,
    lon: location?.lon,
  });

  const { data, isLoading, error } = useData<WeatherData>("/data/3.0/onecall", {
    params: {
      lat: location?.lat,
      lon: location?.lon,
      exclude: "minutely",
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || errorMessage || geoErrorMessage) {
    return (
      <div>
        {error && <div>Weather data error: {error}</div>}
        {errorMessage && <div>Location error: {errorMessage}</div>}
        {geoErrorMessage && <div>Geocoding error: {geoErrorMessage}</div>}
      </div>
    );
  }

  return (
    <Card.Root className="text-gray-50 border-4 border-gray-100 shadow-lg p-8 bg-blue-950 rounded-md ">
      <Card.Body gap="2">
        <FaCloud />
        <Card.Title mt="2">
          {locationName ? locationName : "Unknown Location"}
        </Card.Title>
      </Card.Body>
      <div className="flex justify-between items-end">
        <Flex direction={"column"}>
          <Text className="text-gray-50">
            {data?.current.weather.description}
          </Text>
          <Text as="span" fontWeight="bold" className="text-gray-50">
            Feels like: {data?.current.feels_like}°C
          </Text>
        </Flex>
        <Flex direction={"column"}>
          <Text>Wind: {data?.current.wind_speed} kmph</Text>

          <Text>Pressure: {data?.current.pressure} mb</Text>
          <Text className="text-3xl">{data?.current.temp}°C</Text>
        </Flex>
      </div>
    </Card.Root>
  );
};

export default WeatherCard;
