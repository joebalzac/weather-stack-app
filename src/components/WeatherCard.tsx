import { Card, Image, Text } from "@chakra-ui/react";
import useData from "../hooks/useData";
import { FaCloud } from "react-icons/fa";

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
    <Card.Root width="320px">
      <Card.Body gap="2">
        <FaCloud />
        <Card.Title mt="2">
          {data?.location.name} {data?.location.country},{" "}
          {data?.location.region}
        </Card.Title>
        <Card.Description>
          {data?.current.weather_descriptions[0]}
          <Text as="span" fontWeight="bold">
            {" "}
            Feels like: {data?.current.feelslike}°C
          </Text>
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Card.Description>{data?.current.temperature}°C</Card.Description>
      </Card.Footer>
    </Card.Root>
  );
};

export default WeatherCard;
