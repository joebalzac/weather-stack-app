import useData from "../hooks/useData";

interface ForecastData {
  forecast: {
    forecastday: {
      date: string;
      date_epoch: number;
      mintemp: number;
      maxtemp: number;
      totalsnow: number;
    }[];
  };
}

export const WeatherForecast = () => {
  const { data, isLoading, error } = useData<ForecastData>("/forecast", {
    params: {
      forecast_days: 1,
      hourly: 1,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There seems to be an error {error}</div>;
  }

  return (
    <div>
      {data?.forecast.forecastday.map((day) => {
        return (
          <div key={day.date_epoch}>
            <h2>{day.date}</h2>
            <p>Min: {day.mintemp}°C</p>
            <p>Max: {day.maxtemp}°C</p>
            <p>Total snow: {day.totalsnow}mm</p>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherForecast;
