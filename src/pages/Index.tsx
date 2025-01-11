import { useState, useEffect } from "react";
import { toZonedTime } from "date-fns-tz";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import axios from "axios";
import ClockDisplay from "../components/ClockDisplay";
import MoonPhaseInfo from "../components/MoonPhaseInfo";
import DateDisplay from "../components/DateDisplay";
import WaterLevel from "../components/WaterLevel";

const AMSTERDAM_LAT = 52.3676;
const AMSTERDAM_LON = 4.9041;

const Index = () => {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);
  const [moonPhase, setMoonPhase] = useState("");
  const [moonDescription, setMoonDescription] = useState("");
  const [waterLevel, setWaterLevel] = useState(50); // Temporary state, replace with API data
  const isDST = time.getTimezoneOffset() < new Date(time.getFullYear(), 0, 1).getTimezoneOffset();

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://waterberichtgeving.rws.nl/dynamisch/infobord/api/maanfase.html'));
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
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center justify-center p-4 relative">
      <WaterLevel percentage={waterLevel} />
      <div className="w-full max-w-4xl relative z-10">
        <MoonPhaseInfo moonPhase={moonPhase} moonDescription={moonDescription} />
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <ClockDisplay time={utcTime} title="UTC" />
          
          {isDST && (
            <ClockDisplay time={metTime} title="MET" />
          )}
          
          <ClockDisplay 
            time={cetTime} 
            title={isDST ? 'CET' : 'MET/CET'} 
          />
        </div>

        <DateDisplay date={time} />
      </div>
    </div>
  );
};

export default Index;