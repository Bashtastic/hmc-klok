
import { useMemo } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { getHolidayName } from "../utils/holidayUtils";

interface DateDisplayProps {
  date: Date;
  moonPhase: string;
  moonDescription: string;
  moonPercentage?: number;
  isWaning?: boolean;
}

const getMoonPhaseImage = (phase: string, percentage?: number, isWaning?: boolean) => {
  // Als we een percentage hebben, gebruik dan dat om het juiste plaatje te kiezen
  if (percentage !== undefined) {
    // Rond het percentage af naar het dichtstbijzijnde gehele getal
    const roundedPercentage = Math.round(percentage);
    // Kies het dichtstbijzijnde beschikbare plaatje (1-100)
    const imageNumber = Math.max(1, Math.min(100, roundedPercentage));
    return `/moon-phases/${imageNumber}.png`;
  }
  
  // Fallback naar de emoji mapping als er geen percentage beschikbaar is
  const moonImages: { [key: string]: string } = {
    "🌑": "/moon-phases/new-moon.png",
    "🌒": "/moon-phases/waxing-crescent.png",
    "🌓": "/moon-phases/first-quarter.png",
    "🌔": "/moon-phases/waxing-gibbous.png",
    "🌕": "/moon-phases/full-moon.png",
    "🌖": "/moon-phases/waning-gibbous.png",
    "🌗": "/moon-phases/last-quarter.png",
    "🌘": "/moon-phases/waning-crescent.png"
  };
  
  return moonImages[phase] || moonImages["🌑"]; // fallback naar nieuwe maan als de fase niet bekend is
};

const DateDisplay = ({ date, moonPhase, moonDescription, moonPercentage, isWaning }: DateDisplayProps) => {
  const dayName = format(date, "EEEE", { locale: nl });
  
  // Memoize holiday calculation - only recalculate when date changes
  const holidayName = useMemo(() => {
    return getHolidayName(date);
  }, [date.getFullYear(), date.getMonth(), date.getDate()]);
  
  const dateDisplay = format(date, "d MMMM yyyy", { locale: nl });
  const displayText = holidayName 
    ? `${holidayName}, ${dayName} ${dateDisplay}`
    : `${dayName}, ${dateDisplay}`;

  return (
    <div className="flex items-center justify-center w-full mt-[80px]">
      <div className="flex-1 flex justify-end">
        <span 
          className="text-foreground" 
          style={{ 
            fontFamily: "'RO Sans', sans-serif", 
            fontSize: "3rem", 
            display: "inline-block" 
          }}
        >
          {moonDescription}
        </span>
      </div>
      <div className="mx-[50px]">
        <img 
          src={moonPhase ? getMoonPhaseImage(moonPhase, moonPercentage, isWaning) : "/moon-phases/animated_moon.gif"}
          alt={moonDescription || "Loading moon phase..."}
          className="text-foreground flex-shrink-0"
          style={{ 
            width: "96px",
            height: "96px",
            objectFit: "contain",
            transform: isWaning ? 'scaleX(-1)' : 'none'
          }}
        />
      </div>
      <div className="flex-1 flex justify-start">
        <span 
          className="text-foreground" 
          style={{ 
            fontFamily: "'RO Sans', sans-serif", 
            fontSize: "3rem", 
            display: "inline-block" 
          }}
        >
          {displayText}
        </span>
      </div>
    </div>
  );
};

export default DateDisplay;
