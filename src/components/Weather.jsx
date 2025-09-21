import { useState, useEffect } from "react";

const API_KEY = "9fa8999e4e80625dc298a7a03924d0ff";
const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";
const GEO_URL =
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=";

function WeatherCalendar() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get current location weather on component mount
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `${GEO_URL}${latitude}&lon=${longitude}&appid=${API_KEY}`
            );
            if (response.ok) {
              const data = await response.json();
              setCurrentLocation(data);
              setCities([data]);
              setSelectedCity(data);
              await getForecast(data.name);
            }
          } catch (err) {
            console.error("Error fetching current location weather:", err);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to a default city
          addCity("Mumbai");
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      addCity("Mumbai");
    }
  };

  const addCity = async (cityName = newCity) => {
    if (!cityName) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${WEATHER_URL}${cityName}&appid=${API_KEY}`
      );
      if (!response.ok) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const result = await response.json();

      // Check if city already exists
      const cityExists = cities.some((city) => city.id === result.id);
      if (!cityExists) {
        setCities((prev) => [...prev, result]);
        if (!selectedCity) {
          setSelectedCity(result);
          await getForecast(result.name);
        }
      }
      setNewCity("");
    } catch (err) {
      setError("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getForecast = async (cityName) => {
    try {
      const response = await fetch(
        `${FORECAST_URL}${cityName}&appid=${API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        setForecast(data);
      }
    } catch (err) {
      console.error("Error fetching forecast:", err);
    }
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    getForecast(city.name);
  };

  const removeCity = (cityId) => {
    setCities((prev) => prev.filter((city) => city.id !== cityId));
    if (selectedCity && selectedCity.id === cityId) {
      const remainingCities = cities.filter((city) => city.id !== cityId);
      if (remainingCities.length > 0) {
        setSelectedCity(remainingCities[0]);
        getForecast(remainingCities[0].name);
      } else {
        setSelectedCity(null);
        setForecast(null);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addCity();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupForecastByDay = (list) => {
    const grouped = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-2">
          Weather Calendar
        </h1>
        <h4 className="text-red-900 text-center">
          <span className="font-bold">Note:</span> Forecasts are indicative
          only. Accuracy cannot be guaranteed.
        </h4>
      </div>

      {/* Add City Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a city (e.g., London, Tokyo)"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={() => addCity()}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add City"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-row-3 gap-6">
        {/* Cities List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Cities</h2>
          {cities.length === 0 ? (
            <p className="text-gray-500">No cities added yet</p>
          ) : (
            <div className="space-y-2">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className={`p-3 rounded-lg border-2 transition cursor-pointer flex justify-between items-center ${
                    selectedCity && selectedCity.id === city.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => selectCity(city)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{city.name}</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      {Math.round(city.main.temp)}°C
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {city.weather[0].description}
                    </p>
                    {currentLocation && city.id === currentLocation.id && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Current Location
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`}
                      alt={city.weather[0].description}
                      className="w-12 h-12"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCity(city.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weather Calendar */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {selectedCity
              ? `5-Day Forecast for ${selectedCity.name}`
              : "Select a city to view forecast"}
          </h2>

          {forecast && forecast.list ? (
            <div className="space-y-4">
              {Object.entries(groupForecastByDay(forecast.list))
                .slice(0, 5)
                .map(([date, dayForecast]) => (
                  <div key={date} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-3 text-indigo-700">
                      {formatDate(dayForecast[0].dt)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {dayForecast.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border text-center"
                        >
                          <p className="text-sm font-medium text-gray-600">
                            {formatTime(item.dt)}
                          </p>
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt={item.weather[0].description}
                            className="w-10 h-10 mx-auto"
                          />
                          <p className="font-bold text-lg text-indigo-600">
                            {Math.round(item.main.temp)}°C
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.weather[0].description}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>💧 {item.main.humidity}%</p>
                            <p>💨 {Math.round(item.wind.speed)} km/h</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : selectedCity ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading forecast...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Select a city from the left to view its weather forecast
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Time */}
      <div className="text-center mt-6 text-sm text-gray-600">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default WeatherCalendar;
