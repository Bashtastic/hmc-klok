
import { useState, useEffect, useRef } from "react";
import { getTrulyRandomSeaCreature, getRandomSeaCreatureForHour, getNextSeaCreature, type SeaCreature } from "../utils/seaCreatures";

interface SeaCreatureFlagProps {
  time: Date;
  title: string;
  className?: string;
}

const SeaCreatureFlag = ({ time, title, className }: SeaCreatureFlagProps) => {
  const [currentCreature, setCurrentCreature] = useState<SeaCreature>(() => 
    getTrulyRandomSeaCreature()
  );
  const lastHourRef = useRef<number>(time.getHours());
  const lastDayRef = useRef<number>(time.getDate());

  // Update creature only when hour or day actually changes
  useEffect(() => {
    const currentHour = time.getHours();
    const currentDay = time.getDate();
    
    // Only update if hour or day has actually changed from the last recorded values
    if (currentHour !== lastHourRef.current || currentDay !== lastDayRef.current) {
      const hourlyCreature = getRandomSeaCreatureForHour(time);
      setCurrentCreature(hourlyCreature);
      lastHourRef.current = currentHour;
      lastDayRef.current = currentDay;
    }
  }, [time.getHours(), time.getDate()]);

  const handleClick = () => {
    const nextCreature = getNextSeaCreature(currentCreature.path);
    setCurrentCreature(nextCreature);
  };

  return (
    <img 
      src={currentCreature.path}
      alt={`${title} - ${currentCreature.name}`}
      className={`cursor-pointer hover:scale-110 transition-transform object-contain max-w-12 max-h-12 scale-x-[-1] ${className}`}
      onClick={handleClick}
      title={`Click to change sea creature (${currentCreature.name})`}
    />
  );
};

export default SeaCreatureFlag;
