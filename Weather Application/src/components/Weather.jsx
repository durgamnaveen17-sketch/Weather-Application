
import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";

import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef(null);

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": cloud_icon,
    "50n": cloud_icon,
  };

  const search = async (city) => {
    const cityName = city.trim();

    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }

    const apiKey = import.meta.env.VITE_APP_ID;

    if (!apiKey) {
      setError("API key is missing. Check your .env file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(cityName)}` +
        `&units=metric&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch weather data."
        );
      }

      const icon =
        allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.round(data.main.temp),
        location: data.name,
        description: data.weather[0].description,
        icon,
      });
    } catch (err) {
      setWeatherData(null);
      setError(
        err.message === "Failed to fetch"
          ? "Network error. Please check your internet connection."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  const handleSearch = () => {
    search(inputRef.current?.value || "");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          onKeyDown={handleKeyDown}
          aria-label="City name"
        />

        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search weather"
          disabled={loading}
        >
          <img src={search_icon} alt="" />
        </button>
      </div>

      {loading && (
        <p className="status-message">Loading weather...</p>
      )}

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {weatherData && !loading && (
        <>
          <img
            src={weatherData.icon}
            alt={weatherData.description}
            className="weather-icon"
          />

          <p className="temperature">
            {weatherData.temperature}°C
          </p>

          <p className="location">
            {weatherData.location}
          </p>

          <p className="description">
            {weatherData.description}
          </p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
