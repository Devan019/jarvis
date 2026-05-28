"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  MapPin,
  Sunrise,
  Sunset,
  Thermometer,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const wdata = {
  "coord": {
    "lon": 139.6917,
    "lat": 35.6895
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 25.09,
    "feels_like": 25.98,
    "temp_min": 24.58,
    "temp_max": 26,
    "pressure": 997,
    "humidity": 89,
    "sea_level": 997,
    "grnd_level": 996
  },
  "visibility": 10000,
  "wind": {
    "speed": 1.34,
    "deg": 96,
    "gust": 2.68
  },
  "clouds": {
    "all": 100
  },
  "dt": 1779955830,
  "sys": {
    "type": 2,
    "id": 268395,
    "country": "JP",
    "sunrise": 1779910121,
    "sunset": 1779961713
  },
  "timezone": 32400,
  "id": 1850144,
  "name": "Tokyo",
  "cod": 200
}


export default function WeatherCard() {
  const searchParams = useSearchParams();

  // get location from URL
  const location = searchParams.get("location");
  const [weather,SetWeather] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchWeather() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();
      SetWeather(data);
    }catch(err){
      console.error("Failed to fetch weather data", err);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(location){
      fetchWeather();
    }
  },[])

  


  const getWeatherIcon = () => {
    switch (weather?.weather?.[0]?.main) {
      case "Clouds":
        return <Cloud className="w-20 h-20 text-white" />;
      case "Rain":
        return <CloudRain className="w-20 h-20 text-white" />;
      case "Clear":
        return <Sun className="w-20 h-20 text-yellow-300" />;
      default:
        return <Cloud className="w-20 h-20 text-white" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if(isLoading){
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6 overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-xl"
        >
          Loading weather data...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Blur */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-120px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-120px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="p-10 flex flex-col justify-between bg-gradient-to-br from-cyan-500/30 to-blue-600/20">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-white/80 mb-6"
              >
                <MapPin size={18} />
                <span className="text-lg">
                  {weather?.name}, {weather?.sys.country}
                </span>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                }}
                className="mb-6"
              >
                {getWeatherIcon()}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-bold text-white"
              >
                {Math.round(weather?.main.temp)}°
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="capitalize text-2xl text-white/80 mt-2"
              >
                {weather?.description}
              </motion.p>
            </div>

            {/* TEMP RANGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex items-center gap-6"
            >
              <div className="bg-white/10 rounded-2xl p-4 flex-1">
                <p className="text-white/60 text-sm">Min Temp</p>
                <p className="text-white text-2xl font-semibold">
                  {weather?.main.temp_min}°
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 flex-1">
                <p className="text-white/60 text-sm">Max Temp</p>
                <p className="text-white text-2xl font-semibold">
                  {weather?.main.temp_max}°
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-10 text-white">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold mb-8"
            >
              Weather Details
            </motion.h2>

            <div className="grid grid-cols-2 gap-5">
              <WeatherInfoCard
                icon={<Thermometer />}
                title="Feels Like"
                value={`${weather?.main.feels_like}°`}
              />

              <WeatherInfoCard
                icon={<Droplets />}
                title="Humidity"
                value={`${weather?.main.humidity}%`}
              />

              <WeatherInfoCard
                icon={<Wind />}
                title="Wind Speed"
                value={`${weather?.wind.speed} m/s`}
              />

              <WeatherInfoCard
                icon={<Gauge />}
                title="Pressure"
                value={`${weather?.main.pressure} hPa`}
              />

              <WeatherInfoCard
                icon={<Eye />}
                title="Visibility"
                value={`${weather?.visibility / 1000} km`}
              />

              <WeatherInfoCard
                icon={<Cloud />}
                title="Cloudiness"
                value={`${weather?.clouds.all}%`}
              />
            </div>

            {/* SUNRISE / SUNSET */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 grid grid-cols-2 gap-5"
            >
              <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Sunrise className="text-orange-300" />
                  <p className="text-white/70">Sunrise</p>
                </div>

                <h3 className="text-2xl font-bold">
                  {formatTime(weather?.sys.sunrise)}
                </h3>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Sunset className="text-pink-300" />
                  <p className="text-white/70">Sunset</p>
                </div>

                <h3 className="text-2xl font-bold">
                  {formatTime(weather?.sys.sunset)}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function WeatherInfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -5,
      }}
      className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-lg"
    >
      <div className="flex items-center gap-3 text-cyan-300 mb-4">
        {icon}
      </div>

      <p className="text-white/60 text-sm">{title}</p>

      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </motion.div>
  );
}