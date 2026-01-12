
import { format } from "date-fns";
import AnalogClock from "./AnalogClock";
import SeaCreatureFlag from "./SeaCreatureFlag";

interface ClockDisplayProps {
  time: Date;
  title: string;
  flagType?: 'uk' | 'seal' | 'nl' | 'island';
  dstMessage?: string | null;
}

const ClockDisplay = ({ time, title, flagType, dstMessage }: ClockDisplayProps) => {
  const getFlagImage = () => {
    switch (flagType) {
      case 'uk':
        return '/flags/flag-uk.webp';
      case 'nl':
        return '/flags/flag-nl.webp';
      case 'island':
        return '/flags/island.png';
      default:
        return null;
    }
  };

  const flagImage = getFlagImage();

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center">
        <p 
          className="mb-2 text-4xl text-muted-foreground" 
          style={{ 
            fontFamily: "'RO Sans', sans-serif", 
            fontWeight: 400, 
            marginTop: "50px" 
          }}
        >
          {title}
        </p>
        {flagType === 'seal' ? (
          <SeaCreatureFlag 
            time={time}
            title={title}
            className="w-12 h-12 mb-2 mt-12 object-cover absolute left-full ml-2"
          />
        ) : flagImage ? (
          <img 
            src={flagImage} 
            alt={`${title} flag`} 
            className="w-12 h-12 mb-2 mt-12 object-cover absolute left-full ml-2"
          />
        ) : null}
      </div>
      <AnalogClock time={time} dstMessage={dstMessage} />
      <p 
        className="mt-4 text-4xl tracking-wide text-foreground" 
        style={{ 
          fontFamily: "'RO Sans', sans-serif", 
          fontWeight: 400 
        }}
      >
        {format(time, "HH:mm")}
      </p>
    </div>
  );
};

export default ClockDisplay;
