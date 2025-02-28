
import { useState, useEffect } from "react";
import { toZonedTime } from "date-fns-tz";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import axios from "axios";
import ClockDisplay from "../components/ClockDisplay";
import DateDisplay from "../components/DateDisplay";
// import WaterLevel from "../components/WaterLevel"; // Temporarily commented out

const AMSTERDAM_LAT = 52.3676;
const AMSTERDAM_LON = 4.9041;

// Nieuwe interface voor de maanfase data op basis van de nieuwe API-structuur
interface MoonPhaseData {
  maan: {
    symbool: string;
    naam: string;
    percentage_tot_hondert: number;
    is_groeiend: boolean;
    is_slinkend: boolean;
  };
  getijfase: {
    omschrijving: string;
    omschrijving_lang: string;
  };
  timestamp: string;
}

const Index = () => {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);
  const [moonPhase, setMoonPhase] = useState("");
  const [moonDescription, setMoonDescription] = useState("");
  // const [waterLevel, setWaterLevel] = useState(50); // Temporarily commented out
  const isDST = time.getTimezoneOffset() < new Date(time.getFullYear(), 0, 1).getTimezoneOffset();

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const response = await axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://waterberichtgeving.rws.nl/dynamisch/hmc-api/maanfase.json'));
        const data = JSON.parse(response.data.contents) as MoonPhaseData;
        
        // Gebruik de nieuwe JSON-structuur om de maanfase en getijfase te extraheren
        if (data.maan && data.maan.symbool) {
          setMoonPhase(data.maan.symbool.trim());
        }
        
        if (data.getijfase && data.getijfase.omschrijving) {
          setMoonDescription(data.getijfase.omschrijving.trim());
        }
      } catch (error) {
        console.error('Error fetching moon data:', error);
      }
    };

    // Initial fetch
    fetchMoonData();

    // Set up interval to check every second if it's 2 minutes past the hour
    const checkTimeInterval = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() === 2 && now.getSeconds() === 0) {
        fetchMoonData();
      }
    }, 1000);

    return () => {
      clearInterval(checkTimeInterval);
    };
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
    <div className="min-h-screen bg-white bg-opacity-0 dark:bg-background transition-colors duration-300 flex flex-col items-center justify-between p-4 relative">
      {/* Temporarily commented out WaterLevel component */}
      {/* <WaterLevel percentage={waterLevel} /> */}
      <div className="w-full relative z-10 flex flex-col min-h-screen">
        <div className="flex flex-wrap justify-between px-[25%] scale-150 mt-32">
          <ClockDisplay time={utcTime} title="UTC" />
          
          {isDST && (
            <ClockDisplay time={metTime} title="MET" />
          )}
          
          <ClockDisplay 
            time={cetTime} 
            title={isDST ? 'CET' : 'MET / CET'} 
          />
        </div>

        <div className="flex-grow flex items-center justify-center w-screen -ml-4">
          <DateDisplay 
            date={time} 
            moonPhase={moonPhase} 
            moonDescription={moonDescription} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
