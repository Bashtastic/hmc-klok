import { useState, useEffect } from "react";
import { toZonedTime } from "date-fns-tz";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import axios from "axios";
import ClockDisplay from "../components/ClockDisplay";
import DateDisplay from "../components/DateDisplay";

const AMSTERDAM_LAT = 52.3676;
const AMSTERDAM_LON = 4.9041;

const Index = () => {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);
  const [moonPhase, setMoonPhase] = useState("");
  const [moonDescription, setMoonDescription] = useState("");
  const isDST = time.getTimezoneOffset() < new Date(time.getFullYear(), 0, 1).getTimezoneOffset();

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://waterberichtgeving.rws.nl/dynamisch/infobord/api/maanfase.json'));
        const data = JSON.parse(response.data.contents);
        
        if (data.maansymbool) {
          setMoonPhase(data.maansymbool.trim());
        }
        
        if (data.omschrijving_getijfase) {
          setMoonDescription(data.omschrijving_getijfase.trim());
        }
      } catch (error) {
        console.error('Error fetching moon data:', error);
      }
    };

    fetchMoonData();
    const moonDataInterval = setInterval(fetchMoonData, 3600000);

    return () => clearInterval(moonDataInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkDayNight = () => {
      const sunrise = getSunrise(AMSTERDAM_LAT, AMSTERDAM_LON);
      const sunset = getSunset(AMSTERDAM_LAT, AMSTERDAM_LON);
      const now = new Date();
      setIsDark(now < sunrise || now > sunset);
    };

    checkDayNight();
    const interval = setInterval(checkDayNight, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const utcTime = toZonedTime(time, 'UTC');
  const cetTime = toZonedTime(time, 'Europe/Paris');
  const metTime = toZonedTime(time, 'Etc/GMT-1');

  return (
    <div className="min-h-screen bg-[#D3E4FD] dark:bg-background transition-colors duration-300 flex flex-col items-center justify-between p-4 relative">
      <div className="w-full max-w-4xl relative z-10 flex flex-col min-h-screen">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 scale-150 mt-32">
          <ClockDisplay time={utcTime} title="UTC" />
          
          {isDST && (
            <ClockDisplay time={metTime} title="MET" />
          )}
          
          <ClockDisplay 
            time={cetTime} 
            title={isDST ? 'CET' : 'MET/CET'} 
          />
        </div>

        <div className="flex-grow flex items-center justify-center">
          <DateDisplay 
            date={time} 
            moonPhase={moonPhase} 
            moonDescription={moonDescription} 
          />
        </div>
    </div>
  );
};

export default Index;