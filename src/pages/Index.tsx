import { useState, useEffect, useMemo } from "react";
import { toZonedTime } from "date-fns-tz";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import axios from "axios";
import ClockDisplay from "../components/ClockDisplay";
import DateDisplay from "../components/DateDisplay";
import { isKingsDay, kingsDay } from "../utils/colorDefinitions";
import { getDSTTransitionMessage } from "../utils/dstUtils";

const AMSTERDAM_LAT = 52.3676;
const AMSTERDAM_LON = 4.9041;

// Interface for the moon phase data
interface MoonPhaseData {
  maan: {
    symbool: string;
    naam: string;
    percentage: number;
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
  const [moonPercentage, setMoonPercentage] = useState<number | undefined>(undefined);
  const [isWaning, setIsWaning] = useState<boolean | undefined>(undefined);
  const [lastFetchSuccess, setLastFetchSuccess] = useState(false);
  const [dstMessage, setDstMessage] = useState<string | null>(null);

  // Check for crisis mode and timezone emojis via URL parameters
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      isCrisisMode: params.get("user") === "crisis",
      showTimezoneEmojis: params.get("timezone_emojis") === "true",
    };
  }, []);

  const { isCrisisMode, showTimezoneEmojis } = urlParams;

  const isDST = time.getTimezoneOffset() < new Date(time.getFullYear(), 0, 1).getTimezoneOffset();

  // Check if it's April 1st and within specific time ranges for the prank
  const isAprilFools = time.getMonth() === 3 && time.getDate() === 1;
  const currentHour = time.getHours();
  const shouldRotate =
    isAprilFools &&
    ((currentHour >= 1 && currentHour < 2) ||
      (currentHour >= 6 && currentHour < 7) ||
      (currentHour >= 15 && currentHour < 16));

  // Check if it's Koningsdag (King's Day)
  const kingsday = isKingsDay(time);

  // Parse URL params for theme
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get("theme");

    if (themeParam === "night") {
      setIsDark(true);
    } else if (themeParam === "day") {
      setIsDark(false);
    } else {
      // If no theme parameter is provided, use the automatic day/night detection
      const checkDayNight = () => {
        const sunrise = getSunrise(AMSTERDAM_LAT, AMSTERDAM_LON);
        const sunset = getSunset(AMSTERDAM_LAT, AMSTERDAM_LON);
        const now = new Date();
        setIsDark(now < sunrise || now > sunset);
      };

      checkDayNight();
      const interval = setInterval(checkDayNight, 60000);

      return () => clearInterval(interval);
    }
  }, []);

  // Moon data fetching
  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moon-phase`);
        const data = response.data as MoonPhaseData;

        if (data.maan && data.maan.symbool) {
          setMoonPhase(data.maan.symbool.trim());
        }

        if (data.getijfase && data.getijfase.omschrijving) {
          setMoonDescription(data.getijfase.omschrijving.trim());
        }

        if (data.maan && data.maan.percentage !== undefined) {
          setMoonPercentage(data.maan.percentage);
        }

        if (data.maan && data.maan.is_slinkend !== undefined) {
          setIsWaning(data.maan.is_slinkend);
        }

        setLastFetchSuccess(true);
        console.log("Maanfase data succesvol opgehaald:", data);
      } catch (error) {
        console.error("Error fetching moon data:", error);
        setLastFetchSuccess(false);
      }
    };

    // Initial fetch
    fetchMoonData();

    // Set up interval to check every second if it's 2 minutes past the hour
    const checkTimeInterval = setInterval(() => {
      const now = new Date();

      // If it's 2 minutes past the hour, always fetch new data
      if (now.getMinutes() === 2 && now.getSeconds() === 0) {
        fetchMoonData();
        return;
      }

      // If the last fetch failed, try again every minute
      if (!lastFetchSuccess && now.getSeconds() === 0) {
        console.log("Vorige fetch mislukt, opnieuw proberen...");
        fetchMoonData();
      }
    }, 1000);

    return () => {
      clearInterval(checkTimeInterval);
    };
  }, [lastFetchSuccess]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Memoize DST message - only recalculate when date changes (not every second)
  const memoizedDstMessage = useMemo(() => {
    return getDSTTransitionMessage(time);
  }, [time.getFullYear(), time.getMonth(), time.getDate()]);

  useEffect(() => {
    setDstMessage(memoizedDstMessage);
  }, [memoizedDstMessage]);

  const utcTime = toZonedTime(time, "UTC");
  const cetTime = toZonedTime(time, "Europe/Paris");
  const metTime = toZonedTime(time, "Etc/GMT-1");
  const astTime = toZonedTime(time, "America/Curacao"); // AST UTC-4, no DST

  // Calculate sunrise and sunset times for Amsterdam
  const sunrise = getSunrise(AMSTERDAM_LAT, AMSTERDAM_LON);
  const sunset = getSunset(AMSTERDAM_LAT, AMSTERDAM_LON);

  const formatSunTime = (date: Date) => {
    return date.toLocaleTimeString("nl-NL", { hour: "numeric", minute: "2-digit" });
  };

  // Determine the background style based on whether it's King's Day and not in dark mode
  const bgStyle = !isDark && kingsday ? { backgroundColor: kingsDay.background } : {};

  return (
    <div
      className={`min-h-screen bg-white bg-opacity-0 dark:bg-background transition-colors duration-300 flex flex-col items-center justify-between p-4 relative ${shouldRotate ? "rotate-180" : ""}`}
      style={bgStyle}
    >
      {/* Sunrise - top left corner */}
      <div className="fixed top-4 left-20 flex flex-col items-center z-20">
        <img src={isDark ? "/icons/sunrise.png" : "/icons/sunrise-day-theme.png"} alt="Zonsopkomst" style={{ width: "150px", height: "auto" }} />
        <span className="text-foreground text-5xl mt-2" style={{ fontFamily: "'RO Sans', sans-serif" }}>
          {formatSunTime(sunrise)}
        </span>
      </div>

      {/* Sunset - top right corner */}
      <div className="fixed top-4 right-20 flex flex-col items-center z-20">
        <img src={isDark ? "/icons/sunset.png" : "/icons/sunset-day-theme.png"} alt="Zonsondergang" style={{ width: "150px", height: "auto" }} />
        <span className="text-foreground text-5xl mt-2" style={{ fontFamily: "'RO Sans', sans-serif" }}>
          {formatSunTime(sunset)}
        </span>
      </div>

      <div className="w-full relative z-10 flex flex-col min-h-screen">
        <div
          className={`flex flex-wrap justify-between ${isCrisisMode ? "px-[20%]" : isDST ? "px-[20%]" : "px-[30%]"} scale-150 mt-32 mb-16`}
        >
          {isCrisisMode && <ClockDisplay time={astTime} title="AST" flagType={showTimezoneEmojis ? "island" : undefined} />}

          <ClockDisplay time={utcTime} title="UTC" flagType={showTimezoneEmojis ? "uk" : undefined} />

          {!isCrisisMode && isDST && <ClockDisplay time={metTime} title="MET" flagType={showTimezoneEmojis ? "seal" : undefined} />}

          <ClockDisplay time={cetTime} title={isDST ? "CET" : "MET / CET"} flagType={showTimezoneEmojis ? "nl" : undefined} dstMessage={dstMessage} />
        </div>

        <div className="flex-grow flex items-center justify-center w-screen -ml-4">
          <DateDisplay
            date={time}
            moonPhase={moonPhase}
            moonDescription={moonDescription}
            moonPercentage={moonPercentage}
            isWaning={isWaning}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
