
import { format } from "date-fns";
import AnalogClock from "./AnalogClock";

interface ClockDisplayProps {
  time: Date;
  title: string;
  flagType?: 'uk' | 'seal' | 'nl';
}

const ClockDisplay = ({ time, title, flagType }: ClockDisplayProps) => {
  const getFlagImage = () => {
    switch (flagType) {
      case 'uk':
        return '/flags/flag-uk.webp';
      case 'seal':
        return '/flags/seal.png';
      case 'nl':
        return '/flags/flag-nl.webp';
      default:
        return null;
    }
  };

  const flagImage = getFlagImage();

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <p 
          className="mb-2 text-4xl text-muted-foreground" 
          style={{ 
            fontFamily: "'Roboto', sans-serif", 
            fontWeight: 400, 
            marginTop: "50px" 
          }}
        >
          {title}
        </p>
        {flagImage && (
          <img 
            src={flagImage} 
            alt={`${title} flag`} 
            className="w-15 h-15 mb-2 mt-15 object-cover" 
          />
        )}
      </div>
      <AnalogClock time={time} />
      <p 
        className="mt-4 text-4xl tracking-wide text-foreground" 
        style={{ 
          fontFamily: "'Roboto', sans-serif", 
          fontWeight: 400 
        }}
      >
        {format(time, "HH:mm")}
      </p>
    </div>
  );
};

export default ClockDisplay;
