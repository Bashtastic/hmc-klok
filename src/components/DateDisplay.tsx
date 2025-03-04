
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
  moonPhase: string;
  moonDescription: string;
}

const getMoonPhaseImage = (phase: string) => {
  // Deze mapping functie zet de emoji tekst om naar de juiste afbeelding URL
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

const DateDisplay = ({ date, moonPhase, moonDescription }: DateDisplayProps) => {
  return (
    <div className="flex items-center justify-center w-full mt-[80px]">
      <div className="flex-1 flex justify-end">
        <span className="text-foreground" style={{ fontSize: "3rem" }}>{moonDescription}</span>
      </div>
      <div className="mx-[50px]">
        <img 
          src={moonPhase ? getMoonPhaseImage(moonPhase) : "/moon-phases/animated_moon.gif"}
          alt={moonDescription || "Loading moon phase..."}
          className="text-foreground flex-shrink-0"
          style={{ 
            width: "96px",
            height: "96px",
            objectFit: "contain"
          }}
        />
      </div>
      <div className="flex-1 flex justify-start">
        <span className="text-foreground" style={{ fontSize: "3rem" }}>{format(date, "d MMMM yyyy", { locale: nl })}</span>
      </div>
    </div>
  );
};

export default DateDisplay;
