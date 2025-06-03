
import { useState, useEffect } from "react";
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

  // Update creature when hour changes
  useEffect(() => {
    const hourlyCreature = getRandomSeaCreatureForHour(time);
    setCurrentCreature(hourlyCreature);
  }, [time.getHours(), time.getDate()]); // Also update on day change for more variation

  const handleClick = () => {
    const nextCreature = getNextSeaCreature(currentCreature.path);
    setCurrentCreature(nextCreature);
  };

  return (
    <img 
      src={currentCreature.path}
      alt={`${title} - ${currentCreature.name}`}
      className={`cursor-pointer hover:scale-110 transition-transform ${className}`}
      onClick={handleClick}
      title={`Click to change sea creature (${currentCreature.name})`}
    />
  );
};

export default SeaCreatureFlag;
