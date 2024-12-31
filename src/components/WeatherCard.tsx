import { Card, Flex, Text } from "@chakra-ui/react";
import useData from "../hooks/useData";
import { FaCloud } from "react-icons/fa";
import WeatherForecast from "./WeatherForecast";

interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
  };

  current: {
    temperature: number;
    weather_descriptions: string[];
    observation_time: string;
    weather_icons: string[];
    feelslike: number;
    pressure: number;
    wind_speed: number;
    precip: number;
    humidity: number;
  };
}

const WeatherCard = () => {
  const { data, isLoading, error } = useData<WeatherData>("/current");

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>There seems to be an error {error}</div>;
  }

  return (
    <Card.Root className="text-gray-50 border-4 border-gray-100 shadow-lg p-8 bg-blue-950 rounded-md ">
      <Card.Body gap="2">
        <FaCloud />
        <Card.Title mt="2">
          {data?.location.name} {data?.location.country},{" "}
          {data?.location.region}
        </Card.Title>
      </Card.Body>
      <div className="flex justify-between items-end">
        <Flex direction={"column"}>
          <Text className="text-gray-50">
            {data?.current.weather_descriptions[0]}
          </Text>
          <Text as="span" fontWeight="bold" className="text-gray-50">
            Feels like: {data?.current.feelslike}°C
          </Text>
        </Flex>
        <Flex direction={"column"}>
          <Text>Wind: {data?.current.wind_speed} kmph</Text>
          <Text>Precip: {data?.current.precip} mm</Text>
          <Text>Pressure: {data?.current.pressure} mb</Text>
          <Text className="text-3xl">{data?.current.temperature}°C</Text>
        </Flex>
      </div>
    </Card.Root>
  );
};

export default WeatherCard;
