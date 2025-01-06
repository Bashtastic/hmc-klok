import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { Moon } from "lucide-react";
import axios from "axios";
import AnalogClock from "../components/AnalogClock";

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
        const response = await axios.get('https://waterberichtgeving.rws.nl/dynamisch/infobord/zeeland/test.html');
        const htmlContent = response.data;
        
        // Extract moon symbol
        const moonSymbolMatch = htmlContent.match(/maansymbool:\s*([^\n]+)/);
        if (moonSymbolMatch) {
          setMoonPhase(moonSymbolMatch[1].trim());
        }

        // Extract moon phase description
        const moonDescMatch = htmlContent.match(/omschrijving_getijfase:\s*([^\n]+)/);
        if (moonDescMatch) {
          setMoonDescription(moonDescMatch[1].trim());
        }
      } catch (error) {
        console.error('Error fetching moon data:', error);
      }
    };

    fetchMoonData();
    const moonDataInterval = setInterval(fetchMoonData, 3600000); // Update every hour

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
    const interval = setInterval(checkDayNight, 60000); // Check every minute

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
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8 space-x-2">
          <Moon className="w-6 h-6 text-foreground" />
          <span className="text-foreground">{moonPhase}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-foreground">{moonDescription}</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {/* UTC Clock */}
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm font-medium text-muted-foreground">UTC</p>
            <AnalogClock time={utcTime} />
            <p className="mt-4 text-2xl font-light tracking-wide text-foreground">
              {format(utcTime, "HH:mm")}
            </p>
          </div>

          {/* MET Clock (only during DST) */}
          {isDST && (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm font-medium text-muted-foreground">MET</p>
              <AnalogClock time={metTime} />
              <p className="mt-4 text-2xl font-light tracking-wide text-foreground">
                {format(metTime, "HH:mm")}
              </p>
            </div>
          )}

          {/* CET Clock */}
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm font-medium text-muted-foreground">CET</p>
            <AnalogClock time={cetTime} />
            <p className="mt-4 text-2xl font-light tracking-wide text-foreground">
              {format(cetTime, "HH:mm")}
            </p>
          </div>
        </div>
        <p className="text-center mt-12 text-3xl font-light tracking-wide text-foreground">
          {format(time, "d MMMM", { locale: nl })}
        </p>
      </div>
    </div>
  );
};

export default Index;