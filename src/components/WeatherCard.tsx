import useData from "../hooks/useData";
import {
  FaCloud,
  FaCloudSun,
  FaSnowflake,
  FaSun,
} from "react-icons/fa";
import useLocation from "../hooks/useLocation";
import useGeoCoding from "../hooks/useGeoCoding";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FiSunrise, FiSunset } from "react-icons/fi";

interface HourlyWeather {
  dt: number;
  temp: number;
  feels_like: number;
  weather: { main: string; description: string; icon: string }[];
}

interface DailyWeather {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
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
    sunrise: string;
    sunset: string;
    weather: {
      main: string;
      description: string;
    };
  };
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

const kelvinToFahrenheit = (kelvin: number): string => {
  return `${(((kelvin - 273.15) * 9) / 5 + 32).toFixed(0)}°F`;
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

  const [view, setView] = useState<"current" | "hourly" | "daily">("current");

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

  const getWeatherIcon = (main: string) => {
    const weatherIcons: {
      [key: string]: { icon: IconType; className: string };
    } = {
      Clouds: { icon: FaCloud, className: "text-gray-500" },
      PartlyCloudy: { icon: FaCloudSun, className: "text-yellow-400" },
      Rain: { icon: FaCloud, className: "text-blue-500" },
      Clear: { icon: FaSun, className: "text-yellow-400" },
      Snow: { icon: FaSnowflake, className: "text-white-500" },
    };

    return weatherIcons[main] || { icon: FaCloud, className: "text-gray-400" }; // Default icon and color
  };

  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      {view === "current" && (
        <div>
          <div className="pb-6">
            <h1 className="text-6xl font-semibold">
              {locationName || "Unknown Location"}
            </h1>
            <div className="flex justify-start items-center my-4">
              {React.createElement(
                getWeatherIcon(data?.current.weather.main || "Unknown").icon,
                {
                  className: `text-6xl ${
                    getWeatherIcon(data?.current.weather.main || "Unknown")
                      .className
                  }`,
                }
              )}
              <span className="text-6xl ml-2">
                {kelvinToFahrenheit(data?.current.temp || 0)}
              </span>
            </div>
            <p className="text-xl font-medium">
              Feels like: {kelvinToFahrenheit(data?.current.feels_like || 0)}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <div className="flex flex-col">
              <h4 className="text-gray-50">
                {data?.current.weather.description}
              </h4>
              <h4>Wind: {data?.current.wind_speed} kmph</h4>
              <h4>Pressure: {data?.current.pressure} mb</h4>
            </div>

            <div>
              <FiSunrise className="text-3xl text-yellow-200" />
              <p>
                Sun Rise:{" "}
                {new Date(
                  (Number(data?.current.sunrise) || 0) * 1000
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
            <div>
              <FiSunset className="text-3xl text-orange-600" />
              <p>
                Sunset:{" "}
                {new Date(
                  (Number(data?.current.sunset) || 0) * 1000
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {view === "hourly" && (
        <div>
          <h2 className="text-lg font-semibold  mb-4">48-Hour Forecast</h2>
          <div className="grid grid-cols-8 gap-8">
            {data?.hourly
              .slice(0, 8)
              .map((hour: HourlyWeather, index: number) => (
                <div key={index} className="text-center flex flex-col gap-4">
                  <p className="text-sm">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], {
                      hour: "numeric",
                      hour12: true,
                    })}
                  </p>
                  {React.createElement(
                    getWeatherIcon(hour.weather[0].main || "Unknown").icon,
                    {
                      className: `text-6xl ${
                        getWeatherIcon(hour.weather[0].main || "Unknown")
                          .className
                      }`,
                    }
                  )}
                  <p>{kelvinToFahrenheit(hour.temp)}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {view === "daily" && (
        <div>
          <h2 className="text-lg font-semibold text-center mb-4">
            7-Day Forecast
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-center">
            {data?.daily.slice(0, 8).map((day: DailyWeather, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 items-center bg-blue-600 rounded-lg p-4 shadow"
                >
                  <h3 className="text-sm font-medium">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </h3>

                  {React.createElement(
                    getWeatherIcon(day.weather[0].main || "Unknown").icon,
                    {
                      className: `text-6xl ${
                        getWeatherIcon(day.weather[0].main || "Unknown")
                          .className
                      }`,
                    }
                  )}
                  <p className="text-sm">{kelvinToFahrenheit(day.temp.day)}</p>
                  <div className="text-xs">
                    <p>Min: {kelvinToFahrenheit(day.temp.min)}</p>
                    <p>Max: {kelvinToFahrenheit(day.temp.max)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-around mt-6">
        <button
          className={`px-4 py-2 rounded ${
            view === "current" ? "bg-blue-800" : "bg-blue-600"
          }`}
          onClick={() => setView("current")}
        >
          Current
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "hourly" ? "bg-blue-800" : "bg-blue-600"
          }`}
          onClick={() => setView("hourly")}
        >
          Hourly
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "daily" ? "bg-blue-800" : "bg-blue-600"
          }`}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;
