import useData from "../hooks/useData";
import { FaCloud } from "react-icons/fa";
import useLocation from "../hooks/useLocation";
import useGeoCoding from "../hooks/useGeoCoding";
import { useState } from "react";

interface HourlyWeather {
  dt: number;
  temp: number;
  feels_like: number;
  weather: { main: string; description: string; icon: string };
}

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
  hourly: HourlyWeather[];
}

const kelvinToFahrenheit = (kelvin: number): string => {
  return `${(((kelvin - 273.15) * 9) / 5 + 32).toFixed(2)}°F`;
};

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

  const [showHourly, setShowHourly] = useState(false);

  const handleSelectedHourly = () => {
    setShowHourly(!showHourly);
    console.log("hello motherfucker");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || errorMessage || geoErrorMessage) {
    return (
      <div>
        {error && <div>Weather data error: {error}</div>}
        {errorMessage && <div>Location error: {errorMessage}</div>}
        {geoErrorMessage && <div>GeoCoding error: {geoErrorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center text-gray-50 border-4 border-gray-100 shadow-lg p-8 bg-blue-400 rounded-md w-full">
      <button
        className=" bg-transparent text-white text-2xl border-teal-300 py-1 px-4"
        onClick={handleSelectedHourly}
      >
        {showHourly ? "Show Current" : "Show Hourly"}
      </button>
      {showHourly ? (
        <div>
          <h2>Hourly</h2>
          <div className="flex gap-4">
            {data?.hourly.slice(0, 6).map((hour) => (
              <div>
                <div className="flex flex-col">
                  {new Date(hour.dt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <p>{kelvinToFahrenheit(hour.temp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="pb-6">
            <FaCloud />
            <h1 className="text-6xl pb-4">
              {locationName ? locationName : "Unknown location"}
            </h1>
            <h2 className="text-5xl">
              {kelvinToFahrenheit(data?.current.temp ?? 0)}
            </h2>
            <h3 className="text-1xl text-gray-50 font-semibold py-2">
              Feels like: {kelvinToFahrenheit(data?.current.feels_like ?? 0)}
            </h3>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <h4 className="text-gray-50">
                {data?.current.weather.description}
              </h4>
              <h4>Wind: {data?.current.wind_speed} kmph</h4>
              <h4>Pressure: {data?.current.pressure} mb</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
