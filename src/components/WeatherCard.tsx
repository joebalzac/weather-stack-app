import useData from "../hooks/useData";

interface WeatherData {
  current: {
    temperature: number;
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
    <div>
      <h1>{data?.current.temperature}</h1>
    </div>
  );
};

export default WeatherCard;
