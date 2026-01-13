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
    "🌘": "/moon-phases/waning-crescent.png",
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
  const displayText = holidayName ? `${holidayName}, ${dayName} ${dateDisplay}` : `${dayName}, ${dateDisplay}`;

  return (
    <div className="relative w-full mt-[80px]">
      {/* Moon centered on page */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <img
          src={moonPhase ? getMoonPhaseImage(moonPhase, moonPercentage, isWaning) : "/moon-phases/animated_moon.gif"}
          alt={moonDescription || "Loading moon phase..."}
          className="text-foreground flex-shrink-0"
          style={{
            width: "96px",
            height: "96px",
            objectFit: "contain",
            transform: isWaning ? "scaleX(-1)" : "none",
          }}
        />
      </div>
      {/* Date text positioned to the right of center */}
      <div className="flex flex-col items-start absolute left-1/2 ml-[60px]">
        <span
          className="text-foreground"
          style={{
            fontFamily: "'RO Sans', sans-serif",
            fontSize: "4rem",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {displayText}
        </span>
      </div>
      {/* Moon description centered at 70% width */}
      <span
        className="text-foreground absolute left-[70%] -translate-x-1/2 top-[100px]"
        style={{
          fontFamily: "'RO Sans', sans-serif",
          fontSize: "3rem",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {moonDescription}
      </span>
      {/* Spacer to maintain height */}
      <div className="h-[140px]"></div>
    </div>
  );
};

export default DateDisplay;
